import type { PieceColor } from '../../../Sketches/ChessSketch/elements/Pieces/types';

export type Game = {
    turn: PieceColor;
    facingWhiteToBlack?: boolean;
};

export type Engine = {
    logs: string[];
    bestMove?: string;
    boardPosition?: {
        fen: string;
    };
};

export type Settings = {
    playingWithStockfish: boolean;
    playingWithColor: PieceColor;
    engineSearchDepth: number;
    appColor: string;
    blackColor: string;
    whiteColor: string;
};

export type ChessState = {
    game: Game;
    engine: Engine;
    settings: Settings;
};
