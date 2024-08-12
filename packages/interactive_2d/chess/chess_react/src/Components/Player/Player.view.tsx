import type { FC } from "react";
import Image from "next/image";

import { Flex } from "@ui/Flex";
import knightUrl from "../../Resources/knight.png";
import styles from "./Player.module.scss";

export type PlayerViewProps = {
    name: string;
    elo: number | string;
};

export const PlayerView: FC<PlayerViewProps> = ({ name, elo }) => (
    <Flex
        direction="row"
        className={styles.player}
    >
        <Flex
            justify="center"
            align="center"
            className={styles.imageContainer}
        >
            <Image
                src={knightUrl}
                priority={false}
                width={64}
                height={64}
                alt="User avatar"
            />
        </Flex>

        <Flex
            direction="column"
            justify="center"
            className={styles.playerInfo}
        >
            <span className={styles.name}>{name}</span>

            <span className={styles.elo}>Elo {elo}</span>
        </Flex>
    </Flex>
);