import { King, Rook } from "../Kinds";
import { Piece } from "../Piece";
import { Position } from "../types";
import { HasMoved } from "./HasMoved";

export abstract class CastlePiece extends HasMoved {
    protected get correspondingRow(): 7 | 0 {
        return this.color === "white" ? 7 : 0;
    }

    /**
     * Determines wheter a row composed of positions
     * is empty and also is not treatened by enemy
     * pieces.
     */
    protected checkIfEmptyAndSafe(fromInclusive: number, toInclusive: number): boolean {
        const { board } = this.controller.gameState;

        const min = Math.min(fromInclusive, toInclusive);
        const max = Math.max(fromInclusive, toInclusive);

        for (let i = min; i <= max; i++) {
            const position: Position = {
                row    : this.correspondingRow,
                column : i,
            }

            const piece: Piece | null = board
                ?.[position.row]
                ?.[position.column];
            
            if (piece instanceof Piece) return false; // Because not empty

            const notSafe = this.getEnemyMoves({ disableCastle : true })
                .findIndex(possibleMove =>
                    possibleMove.row === position.row
                    && possibleMove.column === position.column
                ) !== -1;

            if (notSafe) return false;
        }

        return true;
    }

    protected getEnemyMoves({ disableCastle } = { disableCastle : false }): Position[] {
        const enemyMoves: Position[] = [];
        
        for (const piece of this.controller.gameState.board.flat()) {
            if (!(piece instanceof Piece)) continue;
            
            // Search for enemy pieces, discard friendly ones
            if (piece.color === this.color) continue;

            if (piece instanceof Rook || piece instanceof King) {
                const possibleMoves = piece.getPossibleMoves({ disableCastle });
                
                enemyMoves.push(...possibleMoves);
                continue;
            }

            const possibleMoves = piece.getPossibleMoves();

            enemyMoves.push(...possibleMoves);
        }

        return enemyMoves;
    }

    public isTreatened(): boolean {
        const enemyMoves: Position[] = this.getEnemyMoves({ disableCastle : true });

        const isTreatened = enemyMoves.findIndex(possibleMove =>
            possibleMove.row === this.position.row
            && possibleMove.column === this.position.column
        ) !== -1;

        return isTreatened;
    }
}
