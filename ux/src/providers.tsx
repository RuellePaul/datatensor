import React, {createRef, FC} from 'react';
import {Provider} from 'react-redux';
import store from 'src/store';
import {SettingsProvider} from 'src/contexts/SettingsContext';
import {IconButton, jssPreset, StylesProvider, ThemeProvider} from '@material-ui/core';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {Close as CloseIcon} from '@material-ui/icons';
import MomentUtils from '@date-io/moment';
import {SnackbarProvider} from 'notistack';
import useSettings from './hooks/useSettings';
import {createTheme} from './theme';
import {create} from 'jss';
import rtl from 'jss-rtl';

const jss = create({plugins: [...jssPreset().plugins, rtl()]});


const InnerSettingsProviders: FC = ({children}) => {

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
                        autoHideDuration={3000}
                        disableWindowBlurListener
                        preventDuplicate
                        maxSnack={3}
                        ref={snackbarRef}
                        action={(key) => (
                            <IconButton
                                onClick={onCloseSnackbar(key)}
                            >
                                <CloseIcon/>
                            </IconButton>
                        )}
                    >
                        {children}
                    </SnackbarProvider>
                </MuiPickersUtilsProvider>
            </StylesProvider>
        </ThemeProvider>
    )
};


const Providers: FC = ({children}) => {

    return (
        <Provider store={store}>
            <SettingsProvider>
                <InnerSettingsProviders>
                    {children}
                </InnerSettingsProviders>
            </SettingsProvider>
        </Provider>
    )
};

export default Providers;