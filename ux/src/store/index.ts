import {
    TypedUseSelectorHook,
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector
} from 'react-redux';
import {ThunkAction} from 'redux-thunk';
import {Action, configureStore} from '@reduxjs/toolkit';
import {ENABLE_REDUX_DEV_TOOLS} from 'src/constants';
import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    devTools: ENABLE_REDUX_DEV_TOOLS
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
