import type { GenericFunction } from "@common_types/common";

export const pipe = <T, Fn extends GenericFunction = GenericFunction>
    (value: any) => (...funcs: Fn[]) =>
        funcs
            .reduce((arg, fn) => fn(arg), value) as T;
