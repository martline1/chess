/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
    type FC,
    useEffect,
    useRef,
} from "react";

import { useAppDispatch, useAppSelector } from '../../Store/store';
import { pushMessage, setBestMove, updateBoardPosition } from '../../Store/Slices/ChessSlice';
import { GameAreaView } from "./GameArea.view";

export const GameAreaLogic: FC = () => {
    const dispatch = useAppDispatch();

    const engineRef = useRef<Worker>();

    const {
        boardPosition,
        engineSearchDepth,
        playingWithStockfish,
    } = useAppSelector(({ ChessSlice : { engine, settings } }) => ({
        boardPosition        : engine.boardPosition,
        engineSearchDepth    : settings.engineSearchDepth,
        playingWithStockfish : settings.playingWithStockfish,
    }));

    const updateBoardPositionAction = () => {
        if (boardPosition) {
            engineRef.current?.postMessage("uci");
            engineRef.current?.postMessage(`position fen ${boardPosition.fen}`);
            engineRef.current?.postMessage(`go depth ${engineSearchDepth}`);
        }
    };

    // Everytime the board changes, notify Stockfish through the Worker
    useEffect(() => {
        updateBoardPositionAction();
    }, [boardPosition]);

    // Initialize Stockfish in a Webworker, listen to every message
    // received, for each of those, push the message to the store,
    // if it's bestmove, save that in a spacial lot in the store
    useEffect(() => {
        engineRef.current = new Worker("/assets/stockfish-nnue-16.js");

        engineRef.current!.onmessage = (evnt: MessageEvent) => {
            if (typeof evnt.data === "string") {
                dispatch(pushMessage(evnt.data));

                if (evnt.data.startsWith('bestmove')) {
                    const tokens: string[] = evnt.data.split(' ');
                    const bestMove = tokens[1];
    
                    dispatch(setBestMove(bestMove));
                }
            }
        };
        
        return () => {
            engineRef.current?.postMessage("quit");
            engineRef.current?.terminate();
        };
    }, []);

    // useEffect(() => {
    //     const fen = '3r1r1k/pp2Nqbp/3Rb2p/2P1pp2/7P/N1P3P1/PP2QP2/R3K3 w - - 2 30';

    //     dispatch(updateBoardPosition({ fen }));
    // }, []);

    return (
        <GameAreaView
            delegations={{
                playingWithStockfish,
            }}
        />
    );
};