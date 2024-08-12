/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { withDestroy } from "@common_types/pixi.js";
import { Piece } from "../Pieces/Piece";
import { PieceSelectorModal } from "./PieceSelectorModal";

const Mixins = withDestroy();

export type PieceOptionParams = {
    piece: Piece;
    father: PieceSelectorModal;
};

export class PieceOption extends Mixins {
    public readonly piece: Piece;

    private readonly father: PieceSelectorModal;

    constructor(params: PieceOptionParams) {
        super();

        this.piece = params.piece;
        this.father = params.father;

        const position = this.piece.getParsedPosition();
        
        const modalPosition = this.father.boardBuilder!.getPosition();

        // Render piece relative to its position and the current modal
        this.piece.sprite.position.set(
            modalPosition.column + position.column,
            modalPosition.row + position.row,
        );

        this.piece.sprite.on("pointerdown", this.onPieceOptionSelected, this);
    }

    public onPieceOptionSelected(): void {
        this.father.onPieceSelected(this);
    }

    /**
     * @override
     */
    public destroy(): void {
        this.piece.destroy();
    }
}
