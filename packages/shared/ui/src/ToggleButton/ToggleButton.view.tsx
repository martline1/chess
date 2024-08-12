import {
    type FC,
    type ReactNode,
} from "react";
import classNames from "classnames";

import styles from "./ToggleButton.module.scss";

export type ToggleButtonViewProps = {
    index: number;
    buttonId: string;
    updateIndex: (newIndex: number) => unknown;
    currentIndex: number;
    children: ReactNode;
};

export const ToggleButtonView: FC<ToggleButtonViewProps> = ({
    index,
    buttonId,
    updateIndex,
    currentIndex,
    children,
}) => (
    <button
        id={buttonId}
        type="button"
        className={classNames(styles.container, {
            [styles.selected]: currentIndex === index,
        })}
        onClick={() => updateIndex(index)}
    >
        {children}
    </button>
);
