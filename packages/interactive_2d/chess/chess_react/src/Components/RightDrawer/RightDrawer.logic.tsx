/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
    type FC,
    useId,
    useState,
    useEffect,
} from "react";

import { getObligatoryElementById } from "@helpers/getObligatoryElementById";
import { useAppDispatch, useAppSelector } from '../../Store/store';
import { toggleFacingWhiteToBlack } from '../../Store/Slices/ChessSlice/ChessSlice';
import { RightDrawerView } from "./RightDrawer.view";

export const RightDrawerLogic: FC = () => {
    const dispatch = useAppDispatch();

    const contentId = useId();

    const { logs } = useAppSelector(({ ChessSlice : { engine } }) => ({
        logs : engine.logs,
    }));

    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const content = getObligatoryElementById(contentId);

        content.scrollTo({ top : content.scrollHeight });
    }, [tabIndex]);

    const toggleBoard = () => void(dispatch(toggleFacingWhiteToBlack()));

    return (
        <RightDrawerView
            delegations={{
                logs,
                tabIndex,
                contentId,
                setTabIndex,
                toggleBoard,
            }}
        />
    );
};
