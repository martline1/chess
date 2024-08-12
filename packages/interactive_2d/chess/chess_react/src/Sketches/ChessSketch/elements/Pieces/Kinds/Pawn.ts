import { Piece } from "../Piece";
import { Position } from "../types";

export class Pawn extends Piece {
    private _enPassant = false;
    private _hasGoneEnPassant = false;

    /**
     * En passant is a special pawn capture that can only occur
     * when these rules are met:
     * 
     * 1. The capturing pawn must have advanced exactly three
     * ranks to perform this move.
     * 2. The captured pawn must have moved two squares in one
     * move, landing right next to the capturing pawn.
     * 3. The en passant capture must be performed on the turn
     * immediately after the pawn being captured moves. If the
     * player does not capture en passant on that turn, they
     * no longer can do it later.
     */
    public get enPassant(): boolean {
        return this._enPassant;
    }

    /**
     * Updates en passant value determined by the en passant
     * rules.
     */
    public updateEnPassantState(prevPosition?: number, newPosition?: number): void {
        if (!this._hasGoneEnPassant) {
            const canGoEnPassant: boolean = Math.abs((prevPosition ?? 0) - (newPosition ?? 0)) === 2;

            if (canGoEnPassant) {
                this._enPassant = true;
                this._hasGoneEnPassant = true;
            }
        } else {
            this._enPassant = false;
        }
    }

    /**
     * @override
     */
    public getPossibleMoves(): Position[] {
        const { board } = this.controller.gameState;

        console.log({ board, location : "getPossibleMoves" });

        const moves: Position[] = [];
        const isWhite = this.color === "white";
        const position = this.position;

        // Move forward
        const forward = isWhite ? -1 : 1;

        const rowOfStart = forward === 1 ? 1 : 6;

        const extraForward = position.row === rowOfStart
            ? forward
            : 0;

        const times = Math.abs(forward + extraForward);

        for (let i = 1; i <= times; i++) {
            const nextPosition: Position = {
                row    : position.row + (i * forward), 
                column : position.column,
            };
            const nextPiece: Piece | null | undefined = board?.[nextPosition.row]?.[nextPosition.column];
    
            if (typeof nextPiece === "undefined" || nextPiece instanceof Piece) break;

            moves.push(nextPosition);
        }

        // Move diagonally to eat!
        const leftDiagonal: Position = {
            row    : position.row + forward,
            column : position.column - 1,
        };
        const rightDiaonal: Position = {
            row    : position.row + forward,
            column : position.column + 1,
        };

        const leftPiece: Piece | null = board?.[leftDiagonal.row]?.[leftDiagonal.column] ?? null;
        const rightPiece: Piece | null = board?.[rightDiaonal.row]?.[rightDiaonal.column] ?? null;

        if (leftPiece instanceof Piece && leftPiece.color !== this.color) {
            moves.push(leftDiagonal);
        }
        if (rightPiece instanceof Piece && rightPiece.color !== this.color) {
            moves.push(rightDiaonal);
        }
        
        // En Passant
        const leftPawn: Piece | null = board?.[position.row]?.[position.column - 1] ?? null;
        const rightPawn: Piece | null = board?.[position.row]?.[position.column + 1] ?? null;

        if (
            leftPawn instanceof Pawn
            && leftPawn.color !== this.color
            && leftPawn.enPassant
        ) {
            moves.push({
                row    : position.row + forward,
                column : position.column - 1,
            });
        }
        if (
            rightPawn instanceof Pawn
            && rightPawn.color !== this.color
            && rightPawn.enPassant
        ) {
            moves.push({
                row    : position.row + forward,
                column : position.column + 1,
            });
        }

        return moves;
    }

    /**
     * @override
     */
    public onMoveEnd(rawPosition: Position): void {
        const previousPosition: Position = { ...this.position };
        
        this.updateEnPassantState(previousPosition.row, rawPosition.row);

        this.controller.pawnToIgnore = this;

        super.onMoveEnd(rawPosition);

        // if pawn reached the end of the board, trigger a
        // pawn promotion
        if (rawPosition.row === 0 || rawPosition.row === 7) {
            this.controller.pieceSelectorModal.renderModal(this);
        }
    }
}
