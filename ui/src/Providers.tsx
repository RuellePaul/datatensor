import React, {FC} from 'react';
import {LoadingProvider} from './hooks/useLoading';

const Providers: FC = ({children}) => (
    <LoadingProvider>
        {children}
    </LoadingProvider>
);

export default Providers;