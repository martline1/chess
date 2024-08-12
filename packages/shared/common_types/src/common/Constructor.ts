/* eslint-disable @typescript-eslint/no-explicit-any */

export type Constructor = new (...args: any[]) => object;

export type AbstractConstructor = abstract new (...args: any[]) => object;

export type ConstructorOf<T extends Constructor> =
    new (...args: ConstructorParameters<T>) => T;

export type AbstractConstructorOf<T extends AbstractConstructor> =
    new (...args: ConstructorParameters<T>) => T;
