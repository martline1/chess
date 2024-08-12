import type { FC } from "react";

import type {
    WithChildren,
    WithDelegations,
} from "@common_types/react";
import styles from "./CustomScrollbar.module.scss";

export type CustomScrollbarViewProps = WithChildren & WithDelegations<{
    childId: string;
    scrollTop: number;
    handleHeight: number;
    scrollbarOffset: number;
}>;

export const CustomScrollbarView: FC<CustomScrollbarViewProps> = ({
    children,
    delegations : {
        childId,
        scrollTop,
        handleHeight,
        scrollbarOffset,
    },
}) => (
    <>
        <div
            id={childId}
            className={styles.child}
            style={{
                right: `-${scrollbarOffset}px !important`,
                // right: `0`,
            }}
        >
            {children}
        </div>

        <div className={styles.scrollbarContainer}>
            <div className={styles.track}>
                <div
                    className={styles.handle}
                    style={{
                        top    : `${scrollTop}%`,
                        height : `${handleHeight}%`,
                    }}
                >
                    &nbsp;
                </div>
            </div>
        </div>
    </>
);
