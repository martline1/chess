import * as PIXI from 'pixi.js';

import { withDestroy } from './WithDestroy';

const Mixins = withDestroy();

export type PixiSketchParams = {
  backgroundColor: PIXI.ColorSource;
  resizeTo: HTMLElement;
};

export class PixiSketch extends Mixins {
  public app: PIXI.Application<PIXI.Renderer>;

  constructor(params: PixiSketchParams) {
    super();

    this.app = new PIXI.Application();
    
    this.init(params);
  }

  async init(params: PixiSketchParams): Promise<void> {
    await this.app.init({
      antialias  : true,
      background : params.backgroundColor,
      resizeTo   : params.resizeTo,
    });
    
    params.resizeTo.appendChild(this.app.canvas);

    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;

    this.setup();
  }

  setup(): Promise<void> {
    throw new Error('Setup method not implemented.');
  }

  draw?(deltaTime: number): void;

  resize?(): void;

  destroy(): void {
    this.app.destroy(true, {
      children : true,
      texture  : true,
    });  
  }
}
