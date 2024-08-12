import { Piece } from "../Piece";
import { getBishopMoves } from "../Utils/getBishopMoves";
import { Position } from "../types";

export class Bishop extends Piece {
    /**
     * @override
     */
    public getPossibleMoves(): Position[] {
        const getMoves = getBishopMoves.bind(this);

        return getMoves();
    }
}
