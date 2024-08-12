export type ConfigParams = {
    side: number;
    outerPadding: number;
    innerPadding: number;
};

export class Config {
    public readonly side: number;
    public readonly outerPadding: number;
    public readonly innerPadding: number;

    constructor(params: ConfigParams) {
        this.side = params.side;
        this.outerPadding = params.outerPadding;
        this.innerPadding = params.innerPadding;
    }
};
