import type { FC } from "react";
import classNames from "classnames";
import Image from "next/image";

import { Flex } from "@ui/Flex";
import stockfishUrl from "../../Resources/stockfish_icon.png";
import { WithDelegations } from "@common_types/react";
import type { PieceColor } from '../../Sketches/ChessSketch/elements/Pieces/types';
import styles from "./GamePlay.module.scss";

export const pawnSize = 30;

export type GamePlayViewProps = WithDelegations<{
    playingWithColor: PieceColor;
    engineSearchDepth: number;
    playingWithStockfish: boolean;
    handleStockfishToggle: VoidFunction;
    handleSearchDepthChange: (value: string) => void;
    togglePlayingWithColorAction: VoidFunction;
}>;

export const GamePlayView: FC<GamePlayViewProps> = ({
    delegations : {
        playingWithColor,
        engineSearchDepth,
        playingWithStockfish,
        handleStockfishToggle,
        handleSearchDepthChange,
        togglePlayingWithColorAction,
    },
}) => (
    <>
        <h3>Game Play</h3>

        <div style={{ height : "0.5rem" }}>&nbsp;</div>

        <button
            type="button"
            className={classNames(styles.stockfishBtn, {
                [styles.active] : playingWithStockfish,
            })}
            onClick={handleStockfishToggle}
        >
            <Flex
                direction="row"
                align="center"
                justify="flex-start"
            >
                <Image
                    src={stockfishUrl}
                    priority={false}
                    width={64}
                    height={64}
                    alt="Stockfish profile"
                />

                <Flex
                    direction="column"
                    align="flex-start"
                    className={styles.info}
                >
                    <span>Stockfish { playingWithStockfish ? "active" : "is inactive" }</span>

                    <span>Playing VS { playingWithStockfish ? "Stockfish" : "a friend/yourself" }</span>
                </Flex>
            </Flex>
        </button>

        <div style={{ height : "1rem" }}>&nbsp;</div>

        <div className={classNames(styles.engineDepthContainer, {
            [styles.expanded]: playingWithStockfish,
        })}>
            <Flex
                direction="row"
                align="center"
                justify="flex-start"
                className={styles.engineDepth}
            >
                <span>Engine Search Depth:</span>

                <input
                    type="text"
                    value={engineSearchDepth}
                    onChange={evnt => handleSearchDepthChange(evnt.target.value)}
                />
            </Flex>
        </div>

        <div style={{ height : "0.5rem" }}>&nbsp;</div>

        <Flex
            direction="row"
            align="center"
            className={styles.playWithContainer}
        >
            <Flex grow>
                <span>Playing with: { playingWithColor.at(0)?.toUpperCase() + playingWithColor.substring(1) }</span>
            </Flex>

            <button
                type="button"
                onClick={togglePlayingWithColorAction}
                className={styles.togglePawn}
                style={{
                    backgroundColor :
                        playingWithColor === "white" ? "#e3c79b" : "#653b18",
                }}
            >
                <div
                    className={styles.pawnContainer}
                    style={{
                        padding    : "0.2rem",
                        minWidth   : `calc(${pawnSize}px + (2 * 0.2rem))`,
                        minHeight  : `calc(${pawnSize}px + (2 * 0.2rem))`,
                        marginLeft : playingWithColor === "white" ?  `calc(${pawnSize}px - (2  * 0.2rem))` : 0,
                    }}
                >
                    <div
                        className={styles.imageContainer}
                        style={{
                            width      : pawnSize,
                            height     : pawnSize,
                            maxWidth   : pawnSize,
                            maxHeight  : pawnSize,
                        }}
                    >
                        <Image
                            src="/assets/chess_pieces.png"
                            alt="Pawn"
                            width={pawnSize * 6}
                            height={pawnSize * 2}
                            style={playingWithColor === "white" ? {
                                top : 0,
                            } : {
                                bottom : 0,
                            }}
                        />
                    </div>
                </div>
            </button>
        </Flex>
    </>
);
