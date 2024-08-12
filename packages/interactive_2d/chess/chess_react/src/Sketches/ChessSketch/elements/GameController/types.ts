import { PieceColor } from "../Pieces/types";
import { Piece } from "../Pieces/Piece";

export type GameState = {
    turn: PieceColor;
    board: (Piece | null)[][];
};
