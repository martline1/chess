/* eslint-disable @typescript-eslint/no-explicit-any */
import { Piece } from "../Piece";
import { CastlePiece } from "../Utils/CastlePiece";
import { Position } from "../types";
import { Rook } from "./Rook";

export class King extends CastlePiece {
    // TODO: Override the method filterValidMoves to
    // also prevent it to moving to an unsafe position

    /**
     * @override
     */
    public updatePosition(rawPosition: Position): void {
        const previousPosition = this.position;
        const newPosition = rawPosition;

        const goingToRight: boolean = newPosition.column > previousPosition.column;

        // if the King moves two squares, this is a castle
        if (Math.abs(previousPosition.column - newPosition.column) === 2) {
            const rook = this.controller.gameState.board
                ?.[this.correspondingRow]
                ?.[goingToRight ? 7 : 0];
            
            if (rook instanceof Rook) {
                const newRookPosition: Position = {
                    row    : this.correspondingRow,
                    column : newPosition.column + (goingToRight ? -1 : 1),
                };

                rook.updatePosition(newRookPosition);
            }

        }

        // The King calls the super method because it
        // always lands on the correcrt position when castling!
        super.updatePosition(rawPosition);
    }

    /**
     * @override
     */
    public getPossibleMoves({ disableCastle } = { disableCastle : false }): Position[] {
        const { column, row } = this.position;

        // Regular moves
        const possibleMoves = [
            { column, row : row - 1 }, // Top
            { column, row : row + 1 }, // Bottom
            { column : column + 1, row }, // Right
            { column : column - 1, row }, // Left

            { column : column - 1, row : row - 1 }, // Top left
            { column : column + 1, row : row + 1 }, // Top right
            { column : column - 1, row : row + 1 }, // Bottom left
            { column : column + 1, row : row - 1 }, // Bottom right
        ] as Position[];

        if (!disableCastle) {
            const { board } = this.controller.gameState;
    
            // Castle to the left if possible
            const leftRookOriginalColumn = 0 as const;

            const leftRook: Rook | Piece | null = board
                ?.[this.correspondingRow]
                ?.[leftRookOriginalColumn];
    
            const thisIsTreatened: boolean = this.isTreatened();

            const canCastleToLeft: boolean =
                !this.hasMoved
                && leftRook instanceof Rook
                && !leftRook.hasMoved
                && !thisIsTreatened
                && this.checkIfEmptyAndSafe(3, 1) // Check left side
                && !leftRook.isTreatened();
    
            if (canCastleToLeft) {
                possibleMoves.push({
                    row    : this.correspondingRow,
                    column : 2,
                });
            }
    
            // Castle to the right if possible
            const rightRookOriginalColumn = 7 as const;

            const rightRook: Rook | Piece | null = board
                ?.[this.correspondingRow]
                ?.[rightRookOriginalColumn];
            
            const canCastleToRight: boolean =
                !this.hasMoved
                && rightRook instanceof Rook
                && !rightRook.hasMoved
                && !thisIsTreatened
                && this.checkIfEmptyAndSafe(5, 6) // Check right side
                && !rightRook.isTreatened();
            
            if (canCastleToRight) {
                possibleMoves.push({
                    row    : this.correspondingRow,
                    column : 6,
                });
            }
        }

        return this.filterValidMoves(possibleMoves);
    }
}
