import React, {FC} from 'react';

interface LayoutProps {
    children: React.ReactNode
}

const Main: FC<LayoutProps> = ({children}: LayoutProps) => {

    return (
        <main>
            {children}
        </main>
    );
};

export default Main;
