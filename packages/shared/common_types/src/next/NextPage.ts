import type { NextPage as DefaultNextPage } from 'next';

export type NextPageProps<T = object> = T & {
  prefix?: string;
};

export type NextPage<T = object> = DefaultNextPage<NextPageProps<T>>;
