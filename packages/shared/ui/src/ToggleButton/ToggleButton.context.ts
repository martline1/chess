"use client";

import { createContext } from "react";

export type ToggleButtonContextType = {
    index: number;
};

const initialValue: Partial<ToggleButtonContextType> = {};

export const ToggleButtonContext = createContext(initialValue);
