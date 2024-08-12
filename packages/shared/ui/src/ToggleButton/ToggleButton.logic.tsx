"use client";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    type FC,
    type ReactNode,
    useContext,
    useEffect,
    useId,
} from "react";

import { ToggleButtonGroupContext } from "../ToggleButtonGroup/ToggleButtonGroup.context";
import { ToggleButtonContext }      from "./ToggleButton.context";
import { ToggleButtonView }         from "./ToggleButton.view";

export type ToggleButtonLogicProps = {
    children: ReactNode;
};

export const ToggleButtonLogic: FC<ToggleButtonLogicProps> = ({
    children,
}) => {
    const buttonId = useId();

    const {
        index: currentIndex,
        updateIndex,
        updateSize,
        sizes,
    } = useContext(ToggleButtonGroupContext);
    const { index } = useContext(ToggleButtonContext);

    useEffect(() => {
        const button = document.getElementById(buttonId);

        if (!button) {
            throw new Error("Element must exist");
        }

        if (!(index! in sizes!)) {
            updateSize!(index!, button.clientWidth);
        }
    }, [index]);

    return (
        <ToggleButtonView
            index={index!}
            buttonId={buttonId}
            updateIndex={updateIndex!}
            currentIndex={currentIndex!}
        >
            {children}
        </ToggleButtonView>
    );
};
