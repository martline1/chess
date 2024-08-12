/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, type FC } from "react";

import { useAppDispatch, useAppSelector } from "../../Store";
import {
    setEngineSearchDepth,
    togglePlayingWithColor,
    setPlayingWithStockfish,
    setFacingWithToBlack,
} from '../../Store/Slices/ChessSlice';
import { GamePlayView } from "./GamePlay.view";

export const GamePlayLogic: FC = () => {
    const dispatch = useAppDispatch();

    const {
        playingWithColor,
        engineSearchDepth,
        playingWithStockfish,
    } = useAppSelector(({ ChessSlice : { settings } }) => ({
        playingWithColor     : settings.playingWithColor,
        engineSearchDepth    : settings.engineSearchDepth,
        playingWithStockfish : settings.playingWithStockfish,
    }));

    const handleStockfishToggle = () => {
        dispatch(setPlayingWithStockfish(!playingWithStockfish));
    };

    const handleSearchDepthChange = (value: string) => {
        if (!(/^\d+$/.test(value)) && value !== "") return;

        dispatch(setEngineSearchDepth(parseInt(value)));
    };

    const togglePlayingWithColorAction = () => dispatch(togglePlayingWithColor());

    useEffect(() => {
        dispatch(setFacingWithToBlack(playingWithColor === "black"));
    }, [playingWithColor]);

    return (
        <GamePlayView
            delegations={{
                playingWithColor,
                engineSearchDepth,
                playingWithStockfish,
                handleStockfishToggle,
                handleSearchDepthChange,
                togglePlayingWithColorAction,
            }}
        />
    );
};
