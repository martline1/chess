import * as PIXI from "pixi.js";

import { withDestroy } from "@common_types/pixi.js";
import { ChessSketch } from "../..";
import { Config } from "../../dto/Config";
import { BoardBuilder } from "./BoardBuilder";

const Mixins = withDestroy();

export type BoardParams = {
    father: ChessSketch;
    config: Config;
};


export class Board extends Mixins {
    private readonly father: ChessSketch;
    private readonly texts: PIXI.Text[] = [];
    private readonly styles: PIXI.TextStyle[] = [];
    private readonly boardBuilder: BoardBuilder;

    private readonly horizontalLabels: Record<number, string> = {
        0: "a",
        1: "b",
        2: "c",
        3: "d",
        4: "e",
        5: "f",
        6: "g",
        7: "h",
    };

    constructor(params: BoardParams) {
        super();

        this.father = params.father;

        const gameSize = params.config.side
            - (params.config.outerPadding * 2)
            - (params.config.innerPadding * 2);

        const squareSize = gameSize / 8;

        this.boardBuilder = new BoardBuilder({
            rows         : 8,
            columns      : 8,
            squareWidth  : squareSize,
            squareHeight : squareSize,
            config       : params.config,
        });

        this.father.app.stage.addChild(this.boardBuilder.graphics);

        const blackStyle = new PIXI.TextStyle({
            fill: "#653b18",
            fontSize: 22,
            fontWeight: "600",
        });

        const whiteStyle = new PIXI.TextStyle({
            fill: "#e3c79b",
            fontSize: 20,
            fontWeight: "600",
        });

        for (let i = 0; i < 8; i++) {
            const style = (i % 2 === 0) ? whiteStyle : blackStyle;

            const horizontalLabel = new PIXI.Text({
                text : this.horizontalLabels[i],
                style,
            });

            const verticalLabel = new PIXI.Text({
                text: (i + 1) + "",
                style,
            });

            horizontalLabel.position.set(
                (i * squareSize) + params.config.outerPadding + params.config.innerPadding + (0.85 * squareSize),
                (squareSize * 7) + (0.15 * squareSize),
            );

            verticalLabel.position.set(
                params.config.outerPadding + params.config.innerPadding,
                (squareSize * 7) + (0.85 * squareSize) - (squareSize * i),
            );

            this.styles.push(style);
            this.texts.push(horizontalLabel);
            this.texts.push(verticalLabel);

            this.father.app.stage.addChild(horizontalLabel);
            this.father.app.stage.addChild(verticalLabel);
        }
    }

    /**
     * @override
     */
    public destroy(): void {
        for (const style of this.styles) {
            style.destroy(true);
        }

        for (const text of this.texts) {
            text.destroy(true);
        }

        this.boardBuilder.destroy();
    }
}
