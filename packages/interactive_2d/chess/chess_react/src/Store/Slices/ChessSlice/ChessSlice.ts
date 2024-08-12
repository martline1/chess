import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChessState } from "./types";

const initialState: ChessState = {
    game : {
        turn               : "white",
        facingWhiteToBlack : false,
    },
    engine : {
        logs          : [],
        bestMove      : undefined,
        boardPosition : undefined,
    },
    settings : {
        playingWithStockfish : true,
        playingWithColor     : "white",
        engineSearchDepth    : 20,
        appColor             : "#7B61FF",
        blackColor           : "#653b18",
        whiteColor           : "#e3c79b",
    },
};

export const ChessSlice = createSlice({
    name     : "ChessSlice",
    initialState,
    reducers : {
        toggleTurn : state => {
            state.game.turn = (state.game.turn === "white" ? "black" : "white");
        },
        toggleFacingWhiteToBlack : state => {
            state.game.facingWhiteToBlack = !state.game.facingWhiteToBlack;
        },
        togglePlayingWithColor : state => {
            state.settings.playingWithColor = state.settings.playingWithColor === "white" ? "black" : "white";
        },
        setFacingWithToBlack : (state, action: PayloadAction<boolean>) => {
            state.game.facingWhiteToBlack = action.payload;
        },
        pushMessage : (state, action: PayloadAction<string>) => {
            state.engine.logs.push(action.payload);
        },
        setBestMove : (state, action: PayloadAction<string | undefined>) => {
            state.engine.bestMove = action.payload;
        },
        updateBoardPosition : (state, action: PayloadAction<{ fen: string } | undefined>) => {
            state.engine.boardPosition = action.payload;
        },
        setPlayingWithStockfish : (state, action: PayloadAction<boolean>) => {
            state.settings.playingWithStockfish = action.payload;
        },
        setEngineSearchDepth : (state, action: PayloadAction<number>) => {
            state.settings.engineSearchDepth = action.payload;
        },
        setAppColor : (state, action: PayloadAction<string>) => {
            state.settings.appColor = action.payload;
        },
        setBlackColor : (state, action: PayloadAction<string>) => {
            state.settings.blackColor = action.payload;
        },
        setWhiteColor : (state, action: PayloadAction<string>) => {
            state.settings.whiteColor = action.payload;
        },
    },
});

export const {
    toggleTurn,
    pushMessage,
    setAppColor,
    setBestMove,
    setBlackColor,
    setWhiteColor,
    updateBoardPosition,
    setEngineSearchDepth,
    setFacingWithToBlack,
    togglePlayingWithColor,
    setPlayingWithStockfish,
    toggleFacingWhiteToBlack,
} = ChessSlice.actions;
