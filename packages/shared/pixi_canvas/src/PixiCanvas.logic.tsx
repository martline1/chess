/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useId, useRef, type FC } from "react";
import classNames from "classnames";

import { getObligatoryElementById } from "@helpers/getObligatoryElementById"
import type { PixiSketch }          from "@common_types/pixi.js"
import styles from "./PixiCanvas.module.scss";

export type PixiCanvasLogicProps = {
  sketch: typeof PixiSketch;
  className?: string;
};

export const PixiCanvasLogic: FC<PixiCanvasLogicProps> = ({
  sketch: Sketch,
  className,
}) => {
  const containerId = useId();

  const createdSketchRef = useRef<boolean>(false);

  useEffect(() => {
    const container = getObligatoryElementById(containerId);

    let sketch: PixiSketch | undefined;

    if (!createdSketchRef.current) {
      createdSketchRef.current = true;

      sketch = new Sketch({
        backgroundColor: 0x000000,
        resizeTo: container,
      });
    }

    return () => {
      sketch?.destroy();
    };
  }, []);

  return (
    <div
      id={containerId}
      className={classNames(styles.container, className)}
    />
  );
};

