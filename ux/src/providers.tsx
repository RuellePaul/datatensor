import React, {createRef, FC} from 'react';
import {Provider} from 'react-redux';
import store from 'src/store';
import {SettingsProvider} from 'src/store/SettingsContext';
import {IconButton, StyledEngineProvider, Theme, ThemeProvider} from '@mui/material';
import jssPreset from '@mui/styles/jssPreset';
import StylesProvider from '@mui/styles/StylesProvider';
import {Close as CloseIcon} from '@mui/icons-material';
import {SnackbarProvider} from 'notistack';
import useSettings from './hooks/useSettings';
import {createTheme} from './theme';
import {create} from 'jss';
import rtl from 'jss-rtl';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const jss = create({plugins: [...jssPreset().plugins, rtl()]});

const InnerSettingsProviders: FC = ({children}) => {
    const {settings} = useSettings();

    const theme = createTheme({
        theme: settings.theme
    });

    const snackbarRef = createRef<any>();
    const onCloseSnackbar = key => () => snackbarRef.current.closeSnackbar(key);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <StylesProvider jss={jss}>
                    <SnackbarProvider
                        autoHideDuration={3000}
                        disableWindowBlurListener
                        preventDuplicate
                        maxSnack={3}
                        ref={snackbarRef}
                        action={key => (
                            <IconButton
                                onClick={onCloseSnackbar(key)}
                                size="large"
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    >
                        {children}
                    </SnackbarProvider>
                </StylesProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

const Providers: FC = ({children}) => {
    return (
        <Provider store={store}>
            <SettingsProvider>
                <InnerSettingsProviders>{children}</InnerSettingsProviders>
            </SettingsProvider>
        </Provider>
    );
};

export default Providers;
