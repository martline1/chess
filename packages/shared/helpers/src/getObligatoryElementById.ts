export const getObligatoryElementById = (id: string) => {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error("Element must exist!");
    }

    return element;
};
