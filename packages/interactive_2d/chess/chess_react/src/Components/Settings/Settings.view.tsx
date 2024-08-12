"use client";

import type { FC } from "react";

import { Flex } from "@ui/Flex";
import { Language } from "@icons_react/list";
import { ColorInput } from "../ColorInput";
import { useAppDispatch, useAppSelector } from "../../Store";
import {
    setAppColor,
    setBlackColor,
    setWhiteColor,
} from "../../Store/Slices/ChessSlice";
import styles from "./Settings.module.scss";

export const SettingsView: FC = () => {
    const dispatch = useAppDispatch();

    const { appColor, blackColor, whiteColor } = useAppSelector(({ ChessSlice : { settings } }) => ({
        appColor   : settings.appColor,
        blackColor : settings.blackColor,
        whiteColor : settings.whiteColor,
    }));

    return (
        <>
            <h3>Settings</h3>
    
            <div style={{ height : "1rem" }}>&nbsp;</div>

            <button
                type="button"
                className={styles.stockfishBtn}
                onClick={() => ({})}
            >
                <Flex
                    direction="row"
                    align="center"
                    justify="flex-start"
                >
                    <Language />

                    <div style={{ width: "1rem" }}>&nbsp;</div>

                    <span>English</span>
                </Flex>
            </button>

            <div style={{ height : "1rem" }}>&nbsp;</div>
        
            <ColorInput
                label="App Color:"
                color={appColor}
                onChange={newColor => dispatch(setAppColor(newColor))}
                extraEspace
            />
            <ColorInput
                label="Black Color:"
                color={blackColor}
                onChange={newColor => dispatch(setBlackColor(newColor))}
                />
            <ColorInput
                label="White Color:"
                color={whiteColor}
                onChange={newColor => dispatch(setWhiteColor(newColor))}
                extraEspace
            />
        </>
    );
};
