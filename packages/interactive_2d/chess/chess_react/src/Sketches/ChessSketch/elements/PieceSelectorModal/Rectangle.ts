import * as PIXI from "pixi.js";

import { withDestroy } from "@common_types/pixi.js";

const Mixins = withDestroy();

export type RectangleParams = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export class Rectangle extends Mixins {
    public readonly graphics: PIXI.Graphics;

    constructor(params: RectangleParams) {
        super();

        this.graphics = new PIXI.Graphics();

        this.graphics
            .clear()
            .rect(0, 0, params.width, params.height)
            .fill(0xFFFFFF);
        
        this.graphics.alpha = 0.7;
        
        this.graphics.position.set(params.x, params.y);
    }

    /**
     * @override
     */
    public destroy(): void {
        this.graphics.destroy(true);
    }
}
