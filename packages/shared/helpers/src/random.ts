export const getRandom = (min: number, max?: number): number => {
    if (typeof max === "undefined") {
        return Math.random() * min;
    }

    return Math.random() * (max - min) + min;
};

export const getRandomInt = (min: number, max?: number): number => {
    if (typeof max === "undefined") {
        return Math.round(Math.random() * min);
    }

    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);

    return Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
};
