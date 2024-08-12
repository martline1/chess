/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as PIXI from "pixi.js";

import { withDestroy } from "@common_types/pixi.js";
import { ChessSketch } from "../..";
import { Config } from "../../dto/Config";
import { PieceColor, PieceKind, PiecesDict, Position, kinds } from "./types";
import { Piece } from "./Piece";
import { Bishop, King, Pawn, Queen, Rook, knight } from "./Kinds";
import { Constructor } from "@common_types/common";

const Mixins = withDestroy();

export type PiecesLoaderParams = {
    father: ChessSketch;
    config: Config;
};

export class PiecesLoader extends Mixins {
    // TODO: Fix memory lekeage by removing the texture correctly
    private piecesTexture?: PIXI.Texture;
    private readonly father: ChessSketch;
    private readonly config: Config;

    private readonly classes: Record<PieceKind, Constructor> = {
        rook   : Rook,
        bishop : Bishop,
        knight : knight,
        queen  : Queen,
        king   : King,
        pawn   : Pawn,
    };

    public readonly pieces: PiecesDict = {
        white: {},
        black: {},
    } as PiecesDict;

    constructor(params: PiecesLoaderParams) {
        super();

        this.father = params.father;
        this.config = params.config;
    }

    public async loadPieces(): Promise<void> {
        this.piecesTexture = await PIXI.Assets.load("/assets/chess_pieces.png");

        const squareX = this.piecesTexture!.width / 6;
        const squareY = this.piecesTexture!.height / 2;

        for (let isBlack = 0; isBlack < 2; isBlack++) {
            for (let i = 0; i < 6; i++) {
                const x = squareX * i;
                const y = squareY * isBlack;

                const pieceFrame = new PIXI.Rectangle(x, y, squareX, squareY);

                const pieceTexture = new PIXI.Texture({
                    source: this.piecesTexture!._source,
                    frame: pieceFrame,
                });

                const color: PieceColor = isBlack ? "black" : "white";
                const kind: PieceKind = kinds[i];
                const KindClass = this.classes[kind];

                this.pieces[color][kind] = (position: Position, isPlayable = true): Piece => {
                    const piece = new KindClass({
                        kind,
                        color,
                        config     : this.config,
                        texture    : pieceTexture,
                        controller : this.father.gameController!,
                        isPlayable,
                        ...position,
                    });

                    this.father.app.stage.addChild((piece as Piece).sprite);

                    return piece as Piece;
                };
            }
        }
    }

    destroy(): void {
        this.piecesTexture?.destroy(true);

        // @ts-ignore
        delete this.pieces["white"];
        // @ts-ignore
        delete this.pieces["black"];
    }
}
