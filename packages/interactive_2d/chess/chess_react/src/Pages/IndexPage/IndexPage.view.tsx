import type { FC } from "react";

import { Flex } from "@ui/Flex";
import { GameArea } from "../../Components/GameArea";
import { Menu } from "../../Components/Menu";
import { RightDrawer } from "../../Components/RightDrawer";
import styles from "./IndexPage.module.scss";

export const IndexPageView: FC = () => (
    <Flex
        direction="row"
        className={styles.container}
    >
        <Menu />

        <GameArea />

        <RightDrawer />
    </Flex>
);
