import _ from 'lodash';
import {createTheme as createMuiTheme, responsiveFontSizes} from '@mui/material';
import {Theme as MuiTheme, ThemeOptions as MuiThemeOptions} from '@mui/material/styles';
import {THEMES} from 'src/constants';
import components from './components';
import typography from './typography';


export interface Theme extends MuiTheme {
    name: string;
}

type Direction = 'ltr' | 'rtl';

interface ThemeConfig {
    direction?: Direction;
    theme?: string;
}

interface ThemeOptions extends MuiThemeOptions {
    name: string;
}

const baseOptions: MuiThemeOptions = {
    direction: 'ltr',
    typography,
    components,
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1350,
            xl: 1920
        }
    }
};

const themesOptions: ThemeOptions[] = [
    {
        name: THEMES.LIGHT,
        palette: {
            background: {
                default: '#FAFAFA',
                paper: '#FFFFFF'
            }
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        background: '#FFFFFF',
                        boxShadow: '0px 0px 5px #00000029'
                    }
                }
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        cursor: 'pointer'
                    }
                }
            }
        }
    },
    {
        name: THEMES.DARK,
        palette: {
            mode: 'dark',
            background: {
                paper: '#272727'
            }
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        background: '#272727'
                    }
                }
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        cursor: 'pointer'
                    }
                }
            }
        }
    }
];

export const createTheme = (config: ThemeConfig = {}): Theme => {
    let themeOptions = themesOptions.find(theme => theme.name === config.theme);

    if (!themeOptions) {
        console.warn(new Error(`The theme ${config.theme} is not valid`));
        [themeOptions] = themesOptions;
    }

    let theme = createMuiTheme(_.merge({}, baseOptions, themeOptions, { direction: config.direction }));

    theme = responsiveFontSizes(theme);

    return theme as Theme;
};
