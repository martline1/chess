"use client";

import {
    type FC,
    useMemo,
    useState,
    useCallback,
    ReactElement,
} from "react";

import {
    ToggleButtonGroupContext,
    ToggleButtonGroupContextType
} from "./ToggleButtonGroup.context";
import { ToggleButtonGroupView } from "./ToggleButtonGroup.view";
import { ToggleButtonProps }     from "../ToggleButton";

export type ToggleButtonGroupLogicProps = {
    initialIndex?: number;
    onChange?: (index: number) => unknown;
    className?: string;
    children: Array<ReactElement<ToggleButtonProps>>;
};

export const ToggleButtonGroupLogic: FC<ToggleButtonGroupLogicProps> = ({
    initialIndex = 0,
    onChange,
    className,
    children,
}) => {
    const [index, setIndex] = useState(initialIndex);
    const [sizes, setSizes] = useState<number[]>([]);

    const { left, width } = useMemo(() => {
        let newLeft = 0;

        for (let i = 0; i < index; i++) {
            const buttonWidth = sizes[i] ?? 0;

            newLeft += buttonWidth;
        }

        return {
            left  : newLeft,
            width : sizes[index] ?? 0,
        };
    }, [index, sizes]);

    const updateIndex = useCallback((newIndex: number) => {
        setIndex(newIndex);
        onChange?.(newIndex);
    }, []);

    const updateSize = useCallback((key: number, value: number) => {
        setSizes(prev => {
            const newSizes = [...prev];

            newSizes[key] = value;

            return newSizes;
        });
    }, []);

    const state = useMemo<ToggleButtonGroupContextType>(() => ({
        index,
        sizes,
        updateSize,
        updateIndex,
    }), [sizes, index, updateIndex, updateSize]);

    return (
        <ToggleButtonGroupContext.Provider value={state}>
            <ToggleButtonGroupView
                delegations={{
                    left,
                    width,
                    className,
                }}
            >
                {children}
            </ToggleButtonGroupView>
        </ToggleButtonGroupContext.Provider>
    );
};
