import type { FC } from "react";

import { Flex } from "@ui/Flex";
import { GamePlay } from "../GamePlay";
import { Settings } from "../Settings";
import styles from "./Menu.module.scss";

export const MenuView: FC = () => (
    <Flex
        direction="column"
        className={styles.drawerContainer}
    >
        <form>
            <GamePlay />

            <div style={{ height : "2rem" }}>&nbsp;</div>

            <Settings />
        </form>

        <div className={styles.veil}>&nbsp;</div>

        <button
            type="button"
            className={styles.playGameBtn}
        >
            Play Game
        </button>
    </Flex>
);