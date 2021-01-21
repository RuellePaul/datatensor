import React, {FC} from 'react';

import {Header} from './components';

interface LayoutProps {
    children?: React.ReactNode
}

const Main: FC<LayoutProps> = ({children}: LayoutProps) => {

    return (
        <main>
            <Header/>
            {children}
        </main>
    );
};

export default Main;
