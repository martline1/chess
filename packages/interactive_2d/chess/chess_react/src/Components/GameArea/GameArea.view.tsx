import type { FC } from "react";

import { Flex } from "@ui/Flex";
import { Player } from "../Player";
import { PixiCanvas } from "@pixi_canvas/index";
import { ChessSketch } from "../../Sketches/ChessSketch";
import { WithDelegations } from "@common_types/react";
import styles from "./GameArea.module.scss";

export type GameAreaViewProps = WithDelegations<{
    playingWithStockfish?: boolean;
}>;

export const GameAreaView: FC<GameAreaViewProps> = ({
    delegations : {
        playingWithStockfish,
    },
}) => (
    <Flex
        direction="column"
        className={styles.gameArea}
    >
        <Player
            name="StockFish"
            elo={1600}
        />

        <Flex
            grow
            className={styles.pixiCanvasContainer}
        >
            <PixiCanvas sketch={ChessSketch} />
        </Flex>

        <Player name="Guest" elo="??" />
    </Flex>
);
