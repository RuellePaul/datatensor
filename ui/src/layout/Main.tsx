import React, {FC} from 'react';

import {Header} from './components';
import {LoadingProvider} from 'hooks/useLoading';

interface LayoutProps {
    children?: React.ReactNode,
    loading?: boolean
}

const Main: FC<LayoutProps> = ({children, loading}: LayoutProps) => {

    return (
        <main>
            <Header/>
            <LoadingProvider loading={loading}>
                {children}
            </LoadingProvider>
        </main>
    );
};

export default Main;
