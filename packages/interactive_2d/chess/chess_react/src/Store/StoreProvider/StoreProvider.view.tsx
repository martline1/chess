'use client';

import { type FC }  from 'react';
import { Provider } from 'react-redux';

import { WithChildren } from "@common_types/react";
import { store } from '../store';

const StoreProvider: FC<WithChildren> = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

export default StoreProvider;
