import { Rook } from "../Kinds/Rook";
import { Position } from "../types";
import { CastlePiece } from "./CastlePiece";
import { analizeDirections } from "./analizeDirections";

export function getRookMoves<T extends CastlePiece>(this: T, { disableCastle } = { disableCastle : false }): Position[] {
    const { column, row } = this.position;

    const state = {
        "up"    : { shouldContinue: true, getPosition: (i: number) => ({ column, row: row - i }) },
        "down"  : { shouldContinue: true, getPosition: (i: number) => ({ column, row: row + i }) },
        "left"  : {
            shouldContinue: true,
            enableCastle: this instanceof Rook && !disableCastle,
            getPosition: (i: number) => ({ column: column - i, row }),
        },
        "right" : {
            shouldContinue: true,
            enableCastle: this instanceof Rook && !disableCastle,
            getPosition: (i: number) => ({ column: column + i, row }),
        },
    };

    return this.filterValidMoves(analizeDirections.bind(this)((state)));
}
