/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Constructor } from "../common";

export const withDestroy = <T extends Constructor>(Base: T = class {} as T) =>
    class extends Base {
        destroy() {}
    };
