/* eslint-disable react/no-array-index-key */

"use client";

import {
    type FC,
    type ReactElement,
    useMemo,
} from "react";
import classNames from "classnames";

import { WithDelegations }                              from "@common_types/react";
import { ToggleButtonProps }                            from "../ToggleButton";
import { ToggleButtonContext, ToggleButtonContextType } from "../ToggleButton/ToggleButton.context";
import styles                                           from "./ToggleButtonGroup.module.scss";

export type ToggleButtonGroupViewProps = {
    children: Array<ReactElement<ToggleButtonProps>>;
} & WithDelegations<{
    left: number;
    width: number;
    className?: string;
    
}>;

export const ToggleButtonGroupView: FC<ToggleButtonGroupViewProps> = ({
    delegations : {
        left,
        width,
        className,
    },
    children,
}) => (
    <div
        className={classNames(styles.container, className ?? "")}
    >
        { children.map((child, childIndex) => (
            <ChildButton
                key={`${child.key} ${childIndex}`}
                child={child}
                childIndex={childIndex}
            />
        )) }

        <div
            className={styles.pointer}
            style={{
                left,
                width,
            }}
        >
            &nbsp;
        </div>
    </div>
);

const ChildButton: FC<{ child: ReactElement<ToggleButtonProps>, childIndex: number }> = ({
    child,
    childIndex,
}) => {
    const state = useMemo<ToggleButtonContextType>(() => ({
        index : childIndex,
    }), [childIndex]);

    return (
        <ToggleButtonContext.Provider value={state}>
            {child}
        </ToggleButtonContext.Provider>
    );
};
