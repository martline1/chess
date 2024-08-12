import { Pawn } from "../Kinds";
import { Piece } from "../Piece";
import { Position } from "../types";

export function onCapture<T extends Piece>(this: T, rawPosition: Position): void {
    const { board } = this.controller.gameState;

    const piece: Piece | null = board
        ?.[rawPosition.row]
        ?.[rawPosition.column];

    if (piece instanceof Piece && piece.color !== this.color) {
        piece.destroy();
    }

    const oneBeforePosition: Position = {
        row    : rawPosition.row + (this.color === "white" ? 1 : -1),
        column : rawPosition.column,
    };

    const oneBeforePiece: Pawn | Piece | null = board
        ?.[oneBeforePosition.row]
        ?.[oneBeforePosition.column];

    // if conditions to capture en passant are met, destroy
    // the captured piece and remove it from the board
    if (
        this instanceof Pawn
        && oneBeforePiece instanceof Pawn
        && oneBeforePiece.color !== this.color
        && oneBeforePiece.enPassant
    ) {
        oneBeforePiece.destroy();

        board[oneBeforePosition.row][oneBeforePosition.column] = null;
    }
}
