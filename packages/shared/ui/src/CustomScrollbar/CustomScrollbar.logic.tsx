"use client";

import {
    type FC,
    type EffectCallback,
    useState,
    useEffect,
    useId,
} from "react";

import { WithChildren }        from "@common_types/react";
import { CustomScrollbarView } from "./CustomScrollbar.view";
import styles                  from "./CustomScrollbar.module.scss";


export type CustomScrollbarLogicComponent = FC<WithChildren> & {
    containerClassName: string;
};

const CustomScrollbarLogic: CustomScrollbarLogicComponent = ({ children }) => {
    const childId = useId();

    const [handleHeight, setHandleHeight] = useState(0);
    const [scrollbarOffset, setScrollbarOffset] = useState(17);
    const [scrollTop, setScrollTop] = useState(0);

    const initListeners: EffectCallback = () => {
        const element = document.getElementById(childId) as HTMLElement;

        // Get exact scrollbar width, and use it to hide it
        setScrollbarOffset(element.offsetWidth - element.clientWidth);

        const getScrollPercentage = (value: number) => (100 * value) / element.scrollHeight;

        const bounding = element.getBoundingClientRect();

        // Calculate the scrollbar-handle height in percentage
        setHandleHeight(getScrollPercentage(bounding.height));

        const onScroll = (_: Event) => setScrollTop(getScrollPercentage(element.scrollTop));

        element.addEventListener("scroll", onScroll);

        return () => {
            element.removeEventListener("scroll", onScroll);
        };
    };

    useEffect(initListeners, []);

    console.log(scrollTop);

    return (
        <CustomScrollbarView
            delegations={{
                childId,
                scrollTop,
                handleHeight,
                scrollbarOffset,
            }}
        >
            {children}
        </CustomScrollbarView>
    );
};

CustomScrollbarLogic.containerClassName = styles.container;

export { CustomScrollbarLogic };
