import type * as PIXI from "pixi.js";

export type WithApp<T> = T & {
    app: PIXI.Application<PIXI.Renderer>;
};
