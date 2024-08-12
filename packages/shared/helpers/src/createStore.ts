import {
    useSelector,
    useDispatch,
    shallowEqual,
    TypedUseSelectorHook,
} from 'react-redux';
import {
    type Reducer,
    type Middleware,
    configureStore,
}  from "@reduxjs/toolkit";

import createSagaMiddleware, { Saga, SagaMiddleware } from "redux-saga";

export const createStore = <State, Sagas>(
    sagas: Sagas | null,
    reducers: Reducer<State>,
    middlewares: Middleware[] = [],
) => {
    let sagaMiddleware: SagaMiddleware;

    if (sagas) {
        sagaMiddleware = createSagaMiddleware();

        middlewares.push(sagaMiddleware);
    }

    const store = configureStore({
        reducer: reducers,
        devTools: true,
        middleware: getDefaultMiddleware => {
            const defaultMiddleware = [...getDefaultMiddleware()];

            for (const middleware of middlewares) {
                defaultMiddleware.push(middleware);
            }

            return defaultMiddleware as any;
        }
    });

    if (sagas) {
        sagaMiddleware!.run(sagas as unknown as Saga);
    }

    type RootState = ReturnType<typeof store.getState>;
    type AppDispatch = typeof store.dispatch;

    const useAppDispatch = () => useDispatch<AppDispatch>();
    const useAppSelector: TypedUseSelectorHook<RootState> = (selector) =>
        useSelector(selector, shallowEqual);

    return {
        store,
        useAppDispatch,
        useAppSelector,
    };
};
