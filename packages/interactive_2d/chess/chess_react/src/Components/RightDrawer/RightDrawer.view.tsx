"use client";

import type { Dispatch, FC, SetStateAction } from "react";
import classNames from "classnames";

import { Flex } from "@ui/Flex";
import { ToggleButton } from "@ui/ToggleButton";
import { WithDelegations } from "@common_types/react";
import { ToggleButtonGroup } from "@ui/ToggleButtonGroup";
import {
    Flip,
    RightArrow,
    GameControl,
    HeadWorking,
} from "@icons_react/list";
import styles from "./RightDrawer.module.scss";

export type RightDrawerViewProps = WithDelegations<{
    logs: string[];
    tabIndex: number;
    contentId: string;
    setTabIndex: Dispatch<SetStateAction<number>>;
    toggleBoard: VoidFunction;
}>;

export const RightDrawerView: FC<RightDrawerViewProps> = ({
    delegations : {
        logs,
        tabIndex,
        contentId,
        setTabIndex,
        toggleBoard,
    },
}) => (
    <Flex
        direction="column"
        className={styles.container}
    >
        <ToggleButtonGroup
            initialIndex={tabIndex}
            onChange={(newValue) => setTabIndex(newValue)}
            className={styles.toggleButtonGroup}
        >
            <ToggleButton>
                <GameControl />

                <span>Game</span>
            </ToggleButton>
            <ToggleButton>
                <HeadWorking />

                <span>Stockfish Analizys</span>
            </ToggleButton>
        </ToggleButtonGroup>

        <div className={classNames(styles.upper, styles.veil)}>&nbsp;</div>

        <div
            id={contentId}
            className={styles.content}
        >
            { tabIndex === 0 && (
                <table>
                    <tbody>
                        { Array.from({ length : 67 }).map((_, index) => (
                            <tr key={index}>
                                <td>{ (index + 1) }.&nbsp;</td>
                                <td>e4</td>
                                <td>e5</td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            ) }

            { tabIndex === 1 && (
                logs.map(log => (
                    <>
                        <br />
                        <span key={log}>{log}</span>
                    </>
                ))
            ) }
        </div>

        <div className={classNames(styles.lower, styles.veil)}>&nbsp;</div>

        <Flex
            direction="row"
            align="center"
            className={styles.actions}
        >
            <button
                type="button"
                onClick={toggleBoard}
            >
                <Flip />
            </button>
            <button type="button">
                <RightArrow style={{ transform: "scaleX(-1)" }} />
            </button>
            <button type="button">
                <RightArrow />
            </button>
        </Flex>
    </Flex>
);
