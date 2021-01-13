import React, {FC} from 'react';

interface LayoutProps {
    children: React.ReactNode
}

const Layout: FC<LayoutProps> = ({children}: LayoutProps) => {

    return (
        <main>
            {children}
        </main>
    );
};

export default Layout;
