import React, {FC} from 'react';

import theme from 'theme';
import {ThemeProvider} from '@material-ui/styles';
import {UserProvider} from 'hooks/useUser';

const Providers: FC = ({children}) => (
    <UserProvider>
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    </UserProvider>
);

export default Providers;