import React, {createContext, FC, useContext, useState} from 'react';

import {Fallback} from 'components';

const LoadingContext = createContext({
    loading: false,
    setLoading: (loading: boolean) => {
        return;
    }
});

interface LoadingProviderProps {
    loading?: boolean
}

export const LoadingProvider: FC<LoadingProviderProps> = ({children, loading}) => {

    const setLoading = (loading: boolean) => {
        setState({...state, loading: loading});
    };

    const initState = {
        loading: loading || false,
        setLoading: setLoading
    };

    const [state, setState] = useState(initState);

    return (
        <LoadingContext.Provider value={state}>
            {state.loading && <Fallback/>}
            {children}
        </LoadingContext.Provider>
    )
};


function useLoading() {
    return useContext(LoadingContext);
}

export default useLoading;