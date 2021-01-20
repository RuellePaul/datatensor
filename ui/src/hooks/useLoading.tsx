import React, {createContext, FC, useContext, useState} from 'react';

import {Fallback} from 'components';

const LoadingContext = createContext({
    loading: false,
    setLoading: (loading: boolean) => {
        return;
    }
});

export const LoadingProvider: FC = ({children}) => {

    const setLoading = (loading: boolean) => {
        setState({...state, loading: loading});
    };

    const initState = {
        loading: false,
        setLoading: setLoading
    };

    const [state, setState] = useState(initState);

    return (
        <LoadingContext.Provider value={state}>
            {state.loading
                ? <Fallback>
                    {children}
                </Fallback>
                : <>
                    {children}
                </>
            }
        </LoadingContext.Provider>
    )
};


function useLoading() {
    return useContext(LoadingContext);
}

export default useLoading;