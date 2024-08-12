import * as PIXI from "pixi.js";

import { withDestroy } from "@common_types/pixi.js";
import { ChessSketch } from "../..";
import { Position } from "../Pieces/types";
import { Piece } from "../Pieces/Piece";

const Mixins = withDestroy();

export type PossibleMoveParams = Position & {
    squareX: number;
    squareY: number;
    chessSketch: ChessSketch;
    selectedPiece: Piece;
};

export class PossibleMove extends Mixins {
    private readonly graphics: PIXI.Graphics;
    private readonly chessSketch: ChessSketch;
    private readonly selectedPiece: Piece;

    private readonly rawPosition: Position;
    private readonly parsedPosition: Position;

    constructor(params: PossibleMoveParams) {
        super();

        this.chessSketch = params.chessSketch;
        this.selectedPiece = params.selectedPiece;

        this.rawPosition = {
            column : params.column,
            row    : params.row,
        };

        this.graphics = new PIXI.Graphics();

        this.graphics
            .rect(0, 0, params.squareX, params.squareY)
            .fill(0xAAFFAA);

        this.parsedPosition = this.selectedPiece.getParsedPosition({
            column : params.column,
            row    : params.row,
        });

        this.graphics.interactive = true;
        this.graphics.cursor = "pointer";
        this.graphics.alpha = 0.5;
        this.graphics.x = this.parsedPosition.column - (params.squareX / 2);
        this.graphics.y = this.parsedPosition.row - (params.squareY / 2);
        
        this.graphics.on("pointerdown", this.onPointerDown, this);
        
        this.chessSketch.app.stage.addChild(this.graphics);
    }

    public onPointerDown(): void {
        return this.selectedPiece.onMoveEnd(this.rawPosition);
    }

    /**
     * @override
     */
    public destroy(): void {
        this.graphics.off("pointerdown", this.onPointerDown);
        this.graphics.destroy(true);
    }
}
