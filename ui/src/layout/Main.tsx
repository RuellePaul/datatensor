import React, {FC} from 'react';

import {Header} from './components';
import {LoadingProvider} from 'hooks/useLoading';

interface LayoutProps {
    children?: React.ReactNode
}

const Main: FC<LayoutProps> = ({children}: LayoutProps) => {

    return (
        <main>
            <Header/>
            <LoadingProvider>
                {children}
            </LoadingProvider>
        </main>
    );
};

export default Main;
