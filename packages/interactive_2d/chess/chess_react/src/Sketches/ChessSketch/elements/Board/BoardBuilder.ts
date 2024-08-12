import * as PIXI from "pixi.js";

import { withDestroy } from "@common_types/pixi.js";
import { Config } from "../../dto/Config";
import { Position } from "../Pieces/types";

const Mixins = withDestroy();

export type BoardBuilderParams = {
    rows: number;
    config: Config;
    columns: number;
    squareWidth: number;
    squareHeight: number;
};

export class BoardBuilder extends Mixins {
    public readonly graphics: PIXI.Graphics;

    private readonly config: Config;
    public readonly width: number;
    public readonly height: number;

    private darkColor = 0x653b18;
    private whiteColor = 0xe3c79b;
    private outerBorderColor = 0xcfa76e;
    private innerBorderColor = 0x653b18;

    constructor(params: BoardBuilderParams) {
        super();

        this.config = params.config;

        const padding = (this.config.outerPadding * 2) + (this.config.innerPadding * 2);

        this.width  = (params.squareWidth * params.columns) + padding;
        this.height = (params.squareHeight * params.rows) + padding;

        this.graphics = new PIXI.Graphics();

        this.graphics
            .clear()
            .rect(0, 0, this.width, this.height)
            .fill(this.outerBorderColor)
            .rect(
                this.config.outerPadding,
                this.config.outerPadding,
                this.width - this.config.outerPadding * 2,
                this.height - this.config.outerPadding * 2,
            )
            .fill(this.innerBorderColor);
        
        const gameSize = Math.max(this.width, this.height)
            - (this.config.outerPadding * 2)
            - (this.config.innerPadding * 2);

        const squareSize = gameSize / Math.max(params.rows, params.columns);

        for (let row = 0; row < params.rows; row++) {
            for (let column = 0; column < params.columns; column++) {
                const color = (row + column) % 2 === 0
                    ? this.whiteColor
                    : this.darkColor;

                const x = column * squareSize + this.config.innerPadding;
                const y = row * squareSize + this.config.innerPadding;

                this.graphics
                    .rect(
                        x + this.config.innerPadding * 2,
                        y + this.config.innerPadding * 2,
                        squareSize,
                        squareSize
                    )
                    .fill(color);
            }
        }
    }

    public getPosition(): Position {
        return {
            column : this.graphics.position.x,
            row    : this.graphics.position.y,
        };
    }

    public setPosition(newPosition: Position): void {
        this.graphics.position.set(
            newPosition.column - this.width / 2,
            newPosition.row - this.height / 2,
        );
    }

    /**
     * @override
     */
    public destroy(): void {
        this.graphics.destroy(true);
    }
}
