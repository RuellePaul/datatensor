import React, {createRef, FC} from 'react';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {create} from 'jss';
import rtl from 'jss-rtl';
import MomentUtils from '@date-io/moment';
import {SnackbarProvider} from 'notistack';
import {Button, jssPreset, StylesProvider, ThemeProvider} from '@material-ui/core';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import GlobalStyles from 'src/components/utils/GlobalStyles';
import ScrollReset from 'src/components/utils/ScrollReset';
import CookiesNotification from 'src/components/overlays/CookiesNotification';
import GoogleAnalytics from 'src/components/utils/GoogleAnalytics';
import SettingsNotification from 'src/components/overlays/SettingsNotification';
import {AuthProvider} from 'src/contexts/AuthContext';
import useSettings from 'src/hooks/useSettings';
import {createTheme} from 'src/theme';
import routes, {renderRoutes} from 'src/routes';

const jss = create({plugins: [...jssPreset().plugins, rtl()]});
const history = createBrowserHistory();

const App: FC = () => {
    const {settings} = useSettings();

    const theme = createTheme({
        direction: settings.direction,
        responsiveFontSizes: settings.responsiveFontSizes,
        theme: settings.theme
    });

    const snackbarRef = createRef<any>();
    const onCloseSnackbar = key => () => snackbarRef.current.closeSnackbar(key);

    return (
        <ThemeProvider theme={theme}>
            <StylesProvider jss={jss}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <SnackbarProvider
                        preventDuplicate
                        maxSnack={3}
                        ref={snackbarRef}
                        action={(key) => (
                            <Button color='inherit' onClick={onCloseSnackbar(key)}>
                                Dismiss
                            </Button>
                        )}
                    >
                        <Router history={history}>
                            <AuthProvider>
                                <GlobalStyles/>
                                <ScrollReset/>
                                <GoogleAnalytics/>
                                <CookiesNotification/>
                                <SettingsNotification/>
                                {renderRoutes(routes)}
                            </AuthProvider>
                        </Router>
                    </SnackbarProvider>
                </MuiPickersUtilsProvider>
            </StylesProvider>
        </ThemeProvider>
    );
};

export default App;
