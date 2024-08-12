import { Piece } from "../Piece";
import { CastlePiece } from "../Utils/CastlePiece";
import { getRookMoves } from "../Utils/getRookMoves";
import { Position } from "../types";
import { King } from "./King";

export class Rook extends CastlePiece {
    /**
     * @override
     */
    public updatePosition(rawPosition: Position): void {
        const desiredPosition = rawPosition;
        const desiredPiece    = this.controller.gameState.board
            ?.[desiredPosition.row]
            ?.[desiredPosition.column];

        // if the desired position contains the king, this is a castle
        if (desiredPiece instanceof King && desiredPiece.color === this.color) {
            const goingToRight: boolean =
                desiredPosition.column > this.position.column;

            const kingsOriginalColumn = 4 as const;

            const newKingColumn = kingsOriginalColumn + (goingToRight ? -2 : 2);

            const newKingPosition: Position = {
                row    : this.correspondingRow,
                column : newKingColumn,
            };

            const newRookPosition: Position = {
                row    : this.correspondingRow,
                column : newKingColumn + (goingToRight ? 1 : -1),
            };

            desiredPiece.updatePosition(newKingPosition); // Move the king
            this.updatePosition(newRookPosition); // Move the rook
        } else {
            super.updatePosition(rawPosition);
        }
    }

    /**
     * @override
     */
    public getPossibleMoves({ disableCastle } = { disableCastle : false }): Position[] {
        const getMoves = getRookMoves.bind(this);

        const moves = getMoves({ disableCastle });

        if (!disableCastle) {
            const kingIndex = moves
                .findIndex(possibleMove =>
                    possibleMove.row === this.correspondingRow
                    && possibleMove.column === 4
                );

            const containsKing: boolean = kingIndex !== -1;

            const king: King | Piece | null = this.controller.gameState.board
                ?.[this.correspondingRow]
                ?.[4];

            // All conditions of the castle are met, we only
            // need to verify if it's safe to do the castle
            // (non of the positions should be under attack!)
            if (containsKing && king instanceof King) {
                const [from, to] = this.position.column === 0
                    ? [1, 3]
                    : [5, 6];

                const isSafe = this.checkIfEmptyAndSafe(from, to);

                if (!isSafe) {
                    // Abort! Not safe to do castle!
                    moves.splice(kingIndex, 1);
                }
            }
        }

        return moves;
    }
}
