import { distance2D } from "./distance";

export type SerializedVector2<T> = {
    x: T;
    y: T;
};

export class Vector2<T> {
    constructor(
        public x: T,
        public y: T,
    ) {}

    static dist(first: Vector2<number>, second: Vector2<number>): number {
        return distance2D(first.x, first.y, second.x, second.y);
    }

    static diff(first: Vector2<number>, second: Vector2<number>) {
        const a = first.x - second.x;
        const b = first.y - second.y;

        return new Vector2(a, b);
    }

    isNumericVector(): this is Vector2<number> {
        return !Number.isNaN(this.x) && !Number.isNaN(this.y);
    }

    apply(fn: (value: T) => T): void {
        this.x = fn(this.x);
        this.y = fn(this.y);
    }

    serialize(): SerializedVector2<T> {
        return {
            x : this.x,
            y : this.y,
        };
    }
}
