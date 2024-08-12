import { Unsubscribe } from "@reduxjs/toolkit";

import { withDestroy } from "@common_types/pixi.js";
import { ChessSketch } from "../..";
import { Pawn } from "../Pieces/Kinds";
import { Piece } from "../Pieces/Piece";
import { PiecesDict } from "../Pieces/types";
import { PossibleMove } from "./PossibleMove";
import { PieceSelectorModal } from "../PieceSelectorModal";
import { store } from '../../../../Store/store';
import { GameState } from "./types";

const Mixins = withDestroy();

// TODO: Implement free hand mode on the left drawer

export type GameControllerParams = {
    father: ChessSketch;
    pieces: PiecesDict;
    pieceSelectorModal: PieceSelectorModal;
};

export class GameController extends Mixins {
    private readonly father: ChessSketch;
    private readonly pieces: PiecesDict;
    private readonly callToUnsubscribe: Unsubscribe;

    private selectedPiece?: Piece;
    private possibleMoves: PossibleMove[] = [];

    public pawnToIgnore?: Pawn;
    public readonly pieceSelectorModal: PieceSelectorModal;

    public readonly gameState: GameState = {
        turn  : "white",
        board : Array
            .from({ length : 8 }, () => Array
                .from({ length : 8 }, () => null)
            ),
    };

    constructor(params: GameControllerParams) {
        super();

        this.father = params.father;
        this.pieces = params.pieces;
        this.pieceSelectorModal = params.pieceSelectorModal;

        let previous: boolean | undefined = undefined

        this.callToUnsubscribe = store.subscribe(() => {
            const { game : { facingWhiteToBlack } } = store.getState().ChessSlice;

            if (previous === facingWhiteToBlack) return;
            previous = facingWhiteToBlack;

            this.gameState.board = this.gameState.board.map(row => row.reverse()).reverse();

            for (let row = 0; row < 8; row++) {
                for (let column = 0; column < 8; column++) {
                    const piece: Piece | null = this.gameState.board[row][column];
    
                    if (!(piece instanceof Piece)) continue;
    
                    const position = piece.getParsedPosition({
                        row,
                        column,
                    });
    
                    console.log("updated!");
    
                    piece.sprite.position.set(position.column, position.row);
    
                    piece.position = position;
                }
            }
    
            console.table(this.gameState.board);
        });
    }
        
    public removePossibleMoves() {
        for (const possibleMove of this.possibleMoves) {
            possibleMove.destroy();
        }

        this.possibleMoves = [];
    }

    /**
     * Called when a piece is selected, it shows its
     * possible moves or if it's the same as the
     * current selectedPiece, it deselects it.
     */
    public onPieceSelected(piece: Piece) {
        this.removePossibleMoves();

        if (this.selectedPiece?.getId() === piece.getId()) {
            this.selectedPiece = undefined;

            return;
        }

        this.selectedPiece = piece;

        console.log({ piece, moves : piece.getPossibleMoves() });

        for (const move of piece.getPossibleMoves()) {
            console.log({ move });

            const possibleMove = new PossibleMove({
                chessSketch   : this.father,
                selectedPiece : piece,
                squareX       : piece.sprite.width,
                squareY       : piece.sprite.height,
                ...move,
            });

            this.possibleMoves.push(possibleMove);
        }
    }

    /**
     * Called after the piece has moved to its desired
     * position, this updates the en passant state of
     * the pawns.
     */
    public onPieceMoved(): void {
        this.removePossibleMoves();

        for (const piece of this.gameState.board.flat()) {
            if (!(piece instanceof Pawn)) continue;

            if (piece.getId() === this.pawnToIgnore?.getId()) continue;

            piece.updateEnPassantState();
        }

        this.pawnToIgnore = undefined;
        this.selectedPiece = undefined;
    }

    public startGame() {
        this.pieces.black.rook({ row : 0, column : 0 });
        this.pieces.black.knight({ row : 0, column : 1 });
        this.pieces.black.bishop({ row : 0, column : 2 });
        this.pieces.black.queen({ row : 0, column : 3 });
        this.pieces.black.king({ row : 0, column : 4 });
        this.pieces.black.bishop({ row : 0, column : 5 });
        this.pieces.black.knight({ row : 0, column : 6 });
        this.pieces.black.rook({ row : 0, column : 7 });

        for (let i = 0; i < 8; i++) {
            this.pieces.black.pawn({ row : 1, column : i });
        }

        this.pieces.white.rook({ row : 7, column : 0 });
        this.pieces.white.knight({ row : 7, column : 1 });
        this.pieces.white.bishop({ row : 7, column : 2 });
        this.pieces.white.queen({ row : 7, column : 3 });
        this.pieces.white.king({ row : 7, column : 4 });
        this.pieces.white.bishop({ row : 7, column : 5 });
        this.pieces.white.knight({ row : 7, column : 6 });
        this.pieces.white.rook({ row : 7, column : 7 });

        for (let i = 0; i < 8; i++) {
            this.pieces.white.pawn({ row : 6, column : i });
        }
    }

    /**
     * @override
     */
    public destroy(): void {
        this.removePossibleMoves();
        this.callToUnsubscribe();
    }
}
