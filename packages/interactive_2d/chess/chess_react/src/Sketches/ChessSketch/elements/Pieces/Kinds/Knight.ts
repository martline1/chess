import { Piece } from "../Piece";
import { Position } from "../types";

export class knight extends Piece {
    // TODO: Fucking horse thinks he can eat the king!!!

    /**
     * @override
     */
    public getPossibleMoves(): Position[] {
        const { column, row } = this.position;

        const possibleMoves = [
            { column : column - 1, row : row - 2 },
            { column : column + 1, row : row - 2 },
            { column : column + 2, row : row - 1 },
            { column : column + 2, row : row + 1 },
            { column : column + 1, row : row + 2 },
            { column : column - 1, row : row + 2 },
            { column : column - 2, row : row + 1 },
            { column : column - 2, row : row - 1 },
        ] as Position[];

        return this.filterValidMoves(possibleMoves);
    }
}
