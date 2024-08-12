/* eslint-disable @typescript-eslint/no-explicit-any */
import { Piece } from "../Piece";
import { analizeDirections } from "./analizeDirections";

export function getBishopMoves<T extends Piece>(this: T) {
    const { column, row } = this.position;

    const state = {
        "++": { shouldContinue: true, getPosition: (i: number) => ({ column: column + i, row: row + i }) },
        "--": { shouldContinue: true, getPosition: (i: number) => ({ column: column - i, row: row - i }) },
        "+-": { shouldContinue: true, getPosition: (i: number) => ({ column: column + i, row: row - i }) },
        "-+": { shouldContinue: true, getPosition: (i: number) => ({ column: column - i, row: row + i }) },
    };

    return this.filterValidMoves(analizeDirections.bind(this as any)(state));
};
