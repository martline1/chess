import { Piece } from "./Piece";

export type PieceColor = "white" | "black";
export type PieceKind  = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export type Position = {
    column: number;
    row: number;
};

export type PiecesDict = {
    [color in PieceColor]: {
        [kind in PieceKind]: (position: Position, isPlayable?: boolean) => Piece;
    };
};

export const kinds: PieceKind[] = ["king", "queen", "bishop", "knight", "rook", "pawn"];
