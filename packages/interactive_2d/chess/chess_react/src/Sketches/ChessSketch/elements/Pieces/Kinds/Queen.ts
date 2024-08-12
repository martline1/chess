/* eslint-disable @typescript-eslint/no-explicit-any */
import { Piece } from "../Piece";
import { getBishopMoves } from "../Utils/getBishopMoves";
import { getRookMoves } from "../Utils/getRookMoves";
import { Position } from "../types";

export class Queen extends Piece {
    /**
     * @override
     */
    public getPossibleMoves(): Position[] {
        const rookMoves = getRookMoves.bind(this as any);
        const bishopMoves = getBishopMoves.bind(this);

        return [
            ...rookMoves(),
            ...bishopMoves(),
        ];
    }
}
