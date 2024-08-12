/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PixiSketch, withDestroy } from "@common_types/pixi.js";
import { Board } from "./elements/Board";
import { PiecesLoader } from "./elements/Pieces/PiecesLoader";
import { Config } from "./dto/Config";
import { GameController } from "./elements/GameController";
import { PieceSelectorModal } from "./elements/PieceSelectorModal";

const Mixins = withDestroy(PixiSketch);

export class ChessSketch extends Mixins {
    public gameController?: GameController;

    private board?: Board;
    private piecesLoader?: PiecesLoader;
    private pieceSelectorModal?: PieceSelectorModal;

    /**
     * @override
     */
    public async setup(): Promise<void> {
        const config = new Config({
            outerPadding : 10,
            innerPadding : 5,
            side         : Math.min(
                this.app.renderer.width,
                this.app.renderer.height
            ),
        });

        this.board = new Board({
            father : this,
            config,
        });

        this.piecesLoader = new PiecesLoader({
            father : this,
            config,
        });

        await this.piecesLoader.loadPieces();

        this.pieceSelectorModal = new PieceSelectorModal({
            father : this,
            pieces : this.piecesLoader!.pieces,
            config,
        });

        this.gameController = new GameController({
            father             : this,
            pieces             : this.piecesLoader!.pieces,
            pieceSelectorModal : this.pieceSelectorModal,
        });

        this.gameController.startGame();
    }

    /**
     * @override
     */
    public destroy(): void {
        this.board?.destroy();
        this.gameController?.destroy();
        this.piecesLoader?.destroy();
        this.pieceSelectorModal?.destroy();

        super.destroy();
    }
}
