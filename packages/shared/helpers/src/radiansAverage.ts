import { reduceSummation } from "./reduceSummation";

export const radiansAverage = (radians: number[]) => Math.atan2(
    radians.map(Math.sin).reduce(reduceSummation, 0) / radians.length,
    radians.map(Math.cos).reduce(reduceSummation, 0) / radians.length,
);
