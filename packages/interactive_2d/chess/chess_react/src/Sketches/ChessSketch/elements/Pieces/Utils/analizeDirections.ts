import { Position } from "../types";
import { Piece } from "../Piece";
import { King, Rook } from "../Kinds";
import { CastlePiece } from "./CastlePiece";

/**
 * Goes in one direction (in 2d) until it finds a piece, if
 * it's the same color, it stops, if it is an enemy piece,
 * it adds the position to the possible moves (To eat it!)
 * 
 * Special case: if castle is available and this piece
 * is a rook, it goes one more to select the king
 */
export function analizeDirections<T extends CastlePiece>(
    this: T,
    state: {
        [key: string]: {
            enableCastle?: boolean;
            shouldContinue: boolean,
            getPosition: (i: number) => Position,
        }
    },
): Position[] {
    const possibleMoves = [] as Position[];

    for (let index = 1; index < 8; index++) {
        for (const direction in state) {
            if (!state[direction].shouldContinue) continue;

            const nextPosition = state[direction].getPosition(index);

            const piece: Piece | null | undefined = this.controller.gameState.board
                ?.[nextPosition.row]
                ?.[nextPosition.column];

            if (typeof piece === "undefined") {
                state[direction].shouldContinue = false;
                continue;
            }

            if (piece instanceof Piece) {
                // Handle castle (Rook's perspective)
                if (state[direction].enableCastle) {
                    const king: Piece | null = this.controller.gameState.board
                        ?.[this.correspondingRow]
                        ?.[4];

                    const canCastle: boolean =
                        king instanceof King
                        && !king.hasMoved
                        && this instanceof Rook
                        && !this.hasMoved
                        && !this.isTreatened()
                        && !king.isTreatened();
                    
                    if (canCastle) {
                        possibleMoves.push(nextPosition);
                        state[direction].shouldContinue = false;

                        continue;
                    }
                }

                state[direction].shouldContinue = false;

                // Handle regular piece
                if (piece.color !== this.color) {
                    possibleMoves.push(nextPosition);
                }

                continue;
            }

            possibleMoves.push(nextPosition);
        }
    }

    return possibleMoves;
}
