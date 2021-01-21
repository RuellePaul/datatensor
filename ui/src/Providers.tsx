import React, {FC} from 'react';

import theme from 'theme';
import {ThemeProvider} from '@material-ui/styles';

import {LoadingProvider} from 'hooks/useLoading';
import {UserProvider} from 'hooks/useUser';

const Providers: FC = ({children}) => (
    <UserProvider>
        <ThemeProvider theme={theme}>
            <LoadingProvider>
                {children}
            </LoadingProvider>
        </ThemeProvider>
    </UserProvider>
);

export default Providers;