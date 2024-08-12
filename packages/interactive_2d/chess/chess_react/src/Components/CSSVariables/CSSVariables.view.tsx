"use client";

import type { FC } from "react";

import { useAppSelector } from '../../Store/store';

export const CSSVariablesView: FC = () => {
    const { appColor } = useAppSelector(({ ChessSlice : { settings } }) => ({
        appColor : settings.appColor,
    }));

    return (
        <style jsx global>{`
            :root {
                --primary-color: ${appColor};
            }
        `}</style>
    );
};
