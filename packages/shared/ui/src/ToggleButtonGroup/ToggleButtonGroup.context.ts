"use client";

import { createContext } from "react";

export type ToggleButtonGroupContextType = {
    index: number;
    updateIndex: (newIndex: number) => unknown;
    updateSize: (key: number, value: number) => unknown;
    sizes: number[];
};

const initialValue: Partial<ToggleButtonGroupContextType> = {};

export const ToggleButtonGroupContext = createContext(initialValue);
