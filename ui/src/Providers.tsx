import React, {FC, useEffect} from 'react';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/styles';

import themes from 'theme';
import {useUser} from 'hooks';
import {UserProvider} from 'hooks/useUser';
import config from 'config';

const ThemeProvider: FC = ({children}) => {
    const {user} = useUser();

    // @ts-ignore
    const theme = themes[user.theme || config.DEFAULT_THEME];

    useEffect(() => {
        // @ts-ignore
        document.body.style.background = themes[user.theme || config.DEFAULT_THEME].palette.background.default;
        // @ts-ignore
        console.log(themes[user.theme || config.DEFAULT_THEME].palette)
    }, [user.theme]);

    return (
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    )
};

const Providers: FC = ({children}) => (
    <UserProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </UserProvider>
);

export default Providers;