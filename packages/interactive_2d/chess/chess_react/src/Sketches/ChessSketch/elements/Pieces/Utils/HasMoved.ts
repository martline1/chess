import { Piece } from "../Piece";
import { Position } from "../types";

export abstract class HasMoved extends Piece {
    private _hasMoved = false;

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    /**
     * @override
     */
    public onMoveEnd(rawPosition: Position): void {
        super.onMoveEnd(rawPosition);
        this._hasMoved = true;
    }
}
