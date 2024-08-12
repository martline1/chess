/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { withDestroy } from "@common_types/pixi.js";
import { Pawn } from "../Pieces/Kinds";
import { Config } from "../../dto/Config";
import { ChessSketch } from "../..";
import { PieceColor, PiecesDict, Position } from "../Pieces/types";
import { Rectangle } from "./Rectangle";
import { BoardBuilder } from "../Board/BoardBuilder";
import { PieceOption } from "./PieceOption";

const Mixins = withDestroy();

export type PieceSelectorModalParams = {
    config: Config;
    father: ChessSketch;
    pieces: PiecesDict;
};

export class PieceSelectorModal extends Mixins {
    public readonly config: Config;
    public boardBuilder?: BoardBuilder;

    private promotingPawn?: Pawn;
    private readonly father: ChessSketch;
    private readonly pieces: PiecesDict;

    // Elements of the veil
    private topLeft?: Rectangle;
    private topRight?: Rectangle;
    private bottomLeft?: Rectangle;
    private bottomRight?: Rectangle;

    // Options to choose from to promote the pawn
    private readonly options: PieceOption[] = []

    constructor(params: PieceSelectorModalParams) {
        super();

        this.config = params.config;
        this.father = params.father;
        this.pieces = params.pieces;
    }

    /**
     * Promotes the pawn to the selected piece and removes
     * the promoting pawn from the board, after that, it 
     * closes the modal.
     */
    public onPieceSelected(selectedPiece: PieceOption): void {
        const { board } = this.father.gameController!.gameState;

        const promotingPawnColor    = this.promotingPawn!.color;
        const promotingPawnPosition = this.promotingPawn!.position;

        // Remove promoting pawn
        this.promotingPawn?.destroy();
        board[promotingPawnPosition.row][promotingPawnPosition.column] = null;

        // Create the new piece
        this.pieces[promotingPawnColor][selectedPiece.piece.kind](promotingPawnPosition);

        // Close modal
        this.destroy();
    }

    /**
     * This happens when a pawn reaches the end of the board,
     * a modal appears to let the player choose the piece to
     * promote the pawn to. The player replaces the pawn with
     * a queen, rook, bishop, or knight of the same color.
     */
    public renderModal(promotingPawn: Pawn) {
        this.promotingPawn = promotingPawn;

        promotingPawn.sprite.alpha = 0.5;

        // Covers the board with a veil, except the square piece
        // containing the promoting pawn.
        this.renderVeil(promotingPawn);

        this.renderBoard(promotingPawn);

        // Render the available pieces (options)
        const color: PieceColor = promotingPawn.color;

        this.options.push(
            new PieceOption({
                father : this,
                piece  : this.pieces[color].bishop({ row : 0, column : 0 }, false),
            }),
            new PieceOption({
                father : this,
                piece  : this.pieces[color].queen({ row : 0, column : 1 }, false),
            }),
            new PieceOption({
                father : this,
                piece  : this.pieces[color].rook({ row : 0, column : 2 }, false),
            }),
            new PieceOption({
                father : this,
                piece  : this.pieces[color].knight({ row : 0, column : 3 }, false),
            }),
        );
    }

    private renderBoard(promotingPawn: Pawn): void {
        this.boardBuilder = new BoardBuilder({
            columns      : 4,
            rows         : 1,
            config       : this.config,
            squareWidth  : promotingPawn.sprite.width,
            squareHeight : promotingPawn.sprite.height,
        });

        // TODO: Make the Left Knight face the other direction
        const origin = this.boardBuilder.width / 2;

        const modalPadding = this.config.outerPadding + this.config.innerPadding + (promotingPawn.sprite.width / 2);

        const min = origin + modalPadding;
        const max = this.config.side - origin - modalPadding;
        const pawnPosition = promotingPawn.getParsedPosition();

        const column = Math.max(Math.min(pawnPosition.column, max), min); // max >= column >= min

        const orientation = promotingPawn.color === "white" ? -1 : 1;

        this.boardBuilder.setPosition({
            row : (this.config.side / 2) + (promotingPawn.sprite.height * 2 * orientation),
            column,
        });

        this.father.app.stage.addChild(this.boardBuilder.graphics);
    }

    /**
     * Makes a spiral around the square piece, so everything
     * is covered by a veil except the square piece containing
     * the promoting pawn.
     */
    private renderVeil(promotingPawn: Pawn): void {
        const pawnPosition: Position = promotingPawn.getParsedPosition();

        this.topLeft = new Rectangle({
            x      : 0,
            y      : 0,
            width  : pawnPosition.column - (promotingPawn.sprite.width / 2),
            height : pawnPosition.row + promotingPawn.sprite.height - (promotingPawn.sprite.height / 2),
        });

        this.topRight = new Rectangle({
            x      : pawnPosition.column - (promotingPawn.sprite.width / 2),
            y      : 0,
            width  : this.config.side - pawnPosition.column + (promotingPawn.sprite.width / 2),
            height : pawnPosition.row - (promotingPawn.sprite.height / 2),
        });

        this.bottomLeft = new Rectangle({
            x      : 0,
            y      : pawnPosition.row + promotingPawn.sprite.height - (promotingPawn.sprite.height / 2),
            width  : pawnPosition.column - (promotingPawn.sprite.width / 2) + promotingPawn.sprite.width,
            height : this.config.side - pawnPosition.row + promotingPawn.sprite.height - (promotingPawn.sprite.height / 2),
        });

        this.bottomRight = new Rectangle({
            x      : pawnPosition.column - (promotingPawn.sprite.width / 2) + promotingPawn.sprite.width,
            y      : pawnPosition.row - (promotingPawn.sprite.height / 2),
            width  : this.config.side - pawnPosition.column - (promotingPawn.sprite.width / 2) + promotingPawn.sprite.width,
            height : this.config.side - pawnPosition.row - (promotingPawn.sprite.height / 2) + promotingPawn.sprite.height,
        });

        this.father.app.stage.addChild(this.topLeft.graphics);
        this.father.app.stage.addChild(this.topRight.graphics);
        this.father.app.stage.addChild(this.bottomLeft.graphics);
        this.father.app.stage.addChild(this.bottomRight.graphics);
    }

    private destroyVeil(): void {
        this.topLeft?.destroy();
        this.topRight?.destroy();
        this.bottomLeft?.destroy();
        this.bottomRight?.destroy();
    }

    /**
     * @override
     */
    public destroy(): void {
        for (const option of this.options) {
            option.destroy();
        }

        // reset array
        this.options.length = 0;

        this.boardBuilder?.destroy();
        this.destroyVeil();
    }
}
