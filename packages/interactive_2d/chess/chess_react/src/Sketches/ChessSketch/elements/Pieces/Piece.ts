/* eslint-disable @typescript-eslint/no-explicit-any */
import * as PIXI from "pixi.js";

import { withDestroy } from "@common_types/pixi.js";
import { PieceColor, PieceKind, Position } from "./types";
import { GameController } from "../GameController";
import { King } from "./Kinds";
import { Config } from "../../dto/Config";
import { onCapture } from "./Utils/onCapture";

const Mixins = withDestroy();

export type PieceParams = Position & {
    kind: PieceKind;
    color: PieceColor;
    config: Config;
    texture: PIXI.Texture;
    controller: GameController;
    isPlayable: boolean;
};

export abstract class Piece extends Mixins {
    // TODO: Piece cannot move if that makes the king
    // to be under attack!

    // TODO: Application layout, board in the center
    // TODO: Chess Clock!!!! to the left of the board

    // TODO: When a rook eats a king it activates a
    // weird castle

    public position: Position;
    public readonly kind: PieceKind;
    public readonly color: PieceColor;
    public readonly sprite: PIXI.Sprite;

    private _gameSize = 0;

    protected readonly config: Config;
    protected readonly controller: GameController;

    constructor(params: PieceParams) {
        super();

        this.kind = params.kind;
        this.color = params.color;
        this.config = params.config;
        this.controller = params.controller;
        this.position = {
            row    : params.row,
            column : params.column,
        };

        const squareSize = this.gameSize / 8;

        this.sprite = new PIXI.Sprite(params.texture);

        this.sprite.width = squareSize;
        this.sprite.height = squareSize;
        this.sprite.anchor.set(0.5);
        this.sprite.interactive = true;
        this.sprite.cursor = "pointer";
        
        if (params.isPlayable) {
            this.sprite.on("pointerdown", this.onPointerDown, this);
            this.updatePosition(this.position);
        }
    }

    private get gameSize(): number {
        if (this._gameSize) return this._gameSize;

        const { outerPadding, innerPadding, side } = this.config;

        const newGameSize = side - ((outerPadding + innerPadding) * 2);

        this._gameSize = newGameSize;

        return newGameSize;
    }

    // TODO: Program the Game of Life in c++ for performance
    // add infinite grid zoom and optimize it

    // TODO: Construir una computadora usando funciones y combinadores

    // TODO: Code the game of life using the game of life programmed also, by yourself

    /**
     * Called when a piece is selected.
     */
    private onPointerDown(): void {
        this.controller.onPieceSelected(this);
    }

    /** Creates valid id using the rows and columns */
    public getId(): string {
        return (this.position.row + "") + (this.position.column + "");
    }

    /**
     * Out of the possible moves, filter the ones that
     * are out of the board, empty squares and squares
     * with enemy pieces, eat!
     */
    protected filterValidMoves(moves: Position[]): Position[] {
        const acceptedMoves: Position[] = [];

        for (const move of moves) {
            const piece: Piece | null | undefined = this.controller.gameState.board
                ?.[move.row]
                ?.[move.column];

            // Out of the board
            if (typeof piece === "undefined") continue;

            // Empty square
            if (piece === null) {
                acceptedMoves.push(move);
                continue;
            }

            const isPiece: boolean = piece instanceof Piece;

            // Square with enemy piece, eat!
            if (isPiece && piece.color !== this.color) {
                acceptedMoves.push(move);
            }

            // Square with friendly piece that it's the king, castle!
            if (isPiece && piece instanceof King) {
                acceptedMoves.push(move);
            }
        }

        return [...acceptedMoves];
    }

    /** Parsed means that is the actual pixel position in the canvas */
    public getParsedPosition(defaultPosition?: Position): Position {
        const position = defaultPosition ?? this.position;

        const deltaX =
            (position.column + 1) * this.sprite.width
            - (this.sprite.width / 2)
            + this.config.outerPadding
            + this.config.innerPadding;

        const deltaY =
            (position.row + 1) * this.sprite.height
            - (this.sprite.height / 2)
            + this.config.outerPadding
            + this.config.innerPadding;

        return {
            column : deltaX as any,
            row    : deltaY as any,
        };
    }

    /**
     * This uses raw position [0, 7] to update the game state
     * of the controller, set parsed position and capture
     * pieces if needed.
     */
    public updatePosition(rawPosition: Position): void {
        const { board } = this.controller.gameState;
        
        const handleCapture = onCapture.bind(this);

        // Remove previous position
        board[this.position.row][this.position.column] = null;

        // Update position
        this.position = rawPosition;

        handleCapture(rawPosition);

        // Assign new position
        board[rawPosition.row][rawPosition.column] = this;

        const updatedPosition = this.getParsedPosition();

        this.sprite.position.set(
            updatedPosition.column,
            updatedPosition.row,
        );
    }

    public abstract getPossibleMoves(): Position[];

    /**
     * Called when the desired move has been clicked, when
     * the piece is moving, one single time each turn.
     */
    public onMoveEnd(rawPosition: Position): void {
        this.updatePosition(rawPosition);

        this.controller.onPieceMoved();
    }

    public destroy(): void {
        this.sprite.off("pointerdown", this.onPointerDown);

        // This needs to be false because the texture child
        // of this.sprite is going to be deleted in PiecesLoader
        this.sprite.destroy(false);
    }
}
