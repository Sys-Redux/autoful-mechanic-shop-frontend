import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const rootReducer = combineReducers({
    auth: authReducer,
});

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: ['auth/setUser'],
                },
            }),
        devTools: process.env.NODE_ENV !== 'production',
    });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];