import React, {FC} from 'react';

import theme from 'theme';
import {ThemeProvider} from '@material-ui/styles';
import {LoadingProvider} from 'hooks/useLoading';

const Providers: FC = ({children}) => (
    <ThemeProvider theme={theme}>
        <LoadingProvider>
            {children}
        </LoadingProvider>
    </ThemeProvider>
);

export default Providers;