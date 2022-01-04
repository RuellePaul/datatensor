import _ from 'lodash';
import {createTheme as createMuiTheme, responsiveFontSizes} from '@mui/material';
import {Theme as MuiTheme, ThemeOptions as MuiThemeOptions} from '@mui/material/styles';
import {THEMES} from 'src/constants';
import components from './components';
import typography from './typography';


const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#A5D8FF',
    300: '#66B2FF',
    400: '#3399FF',
    main: '#3399FF', // contrast 3.83:1
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75'
};
export const blueDark = {
    50: '#E2EDF8',
    100: '#CEE0F3',
    200: '#91B9E3',
    300: '#5090D3',
    main: '#3399FF',
    400: '#265D97',
    500: '#1E4976',
    600: '#173A5E',
    700: '#132F4C', // contrast 13.64:1
    800: '#001E3C',
    900: '#0A1929'
};
const grey = {
    50: '#F3F6F9',
    100: '#EAEEF3',
    200: '#E5E8EC',
    300: '#D7DCE1',
    400: '#BFC7CF',
    500: '#AAB4BE',
    600: '#7F8E9D',
    700: '#46505A', // contrast 8.21:1
    800: '#2F3A45', // contrast 11.58:1
    900: '#20262D'
};

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
            lg: 1380,
            xl: 1920
        }
    },
    zIndex: {
        drawer: 1100
    }
};

const themesOptions: ThemeOptions[] = [
    {
        name: THEMES.LIGHT,
        palette: {
            mode: 'light',
            primary: {
                ...blue
            },
            divider: grey[200],
            common: {
                black: '#1D1D1D'
            },
            text: {
                primary: grey[900],
                secondary: grey[700]
            },
            grey,
            error: {
                50: '#FFF0F1',
                100: '#FFDBDE',
                200: '#FFBDC2',
                300: '#FF99A2',
                400: '#FF7A86',
                500: '#FF505F',
                main: '#EB0014', // contrast 4.63:1
                600: '#EB0014',
                700: '#C70011',
                800: '#94000D',
                900: '#570007'
            },
            success: {
                50: '#E9FBF0',
                100: '#C6F6D9',
                200: '#9AEFBC',
                300: '#6AE79C',
                400: '#3EE07F',
                500: '#21CC66',
                600: '#1DB45A',
                main: '#1AA251', // contrast 3.31:1
                700: '#1AA251',
                800: '#178D46',
                900: '#0F5C2E'
            },
            warning: {
                50: '#FFF9EB',
                100: '#FFF4DB',
                200: '#FFEDC2',
                300: '#FFE4A3',
                400: '#FFD980',
                500: '#FCC419',
                600: '#FAB005',
                main: '#F1A204', // does not pass constrast ratio
                700: '#F1A204',
                800: '#DB9A00',
                900: '#8F6400'
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
            },
            MuiButton: {
                styleOverrides: {
                    text: {
                        color: 'white'
                    },
                    contained: {
                        color: 'white',
                        fontWeight: 'bold'
                    }
                }
            },
            MuiList: {
                styleOverrides: {
                    root: {
                        padding: 0
                    }
                }
            }
        }
    },
    {
        name: THEMES.DARK,
        palette: {
            mode: 'dark',
            primary: {
                ...blue
            },
            divider: blueDark[500],
            background: {
                default: blueDark[900],
                paper: blueDark[800]
            },
            common: {
                black: '#1D1D1D'
            }, // @ts-ignore
            text: {
                primary: '#fff',
                secondary: grey[500]
            },
            grey,
            error: {
                50: '#FFF0F1',
                100: '#FFDBDE',
                200: '#FFBDC2',
                300: '#FF99A2',
                400: '#FF7A86',
                500: '#FF505F',
                main: '#EB0014', // contrast 4.63:1
                600: '#EB0014',
                700: '#C70011',
                800: '#94000D',
                900: '#570007'
            },
            success: {
                50: '#E9FBF0',
                100: '#C6F6D9',
                200: '#9AEFBC',
                300: '#6AE79C',
                400: '#3EE07F',
                500: '#21CC66',
                600: '#1DB45A',
                main: '#1DB45A', // contrast 6.17:1 (blueDark.800)
                700: '#1AA251',
                800: '#178D46',
                900: '#0F5C2E'
            },
            warning: {
                50: '#FFF9EB',
                100: '#FFF4DB',
                200: '#FFEDC2',
                300: '#FFE4A3',
                400: '#FFD980',
                500: '#FCC419',
                600: '#FAB005',
                main: '#F1A204', // does not pass constrast ratio
                700: '#F1A204',
                800: '#DB9A00',
                900: '#8F6400'
            }
        },
        components: {
            MuiLink: {
                styleOverrides: {
                    root: {
                        cursor: 'pointer'
                    }
                }
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        color: 'white !important'
                    }
                }
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        color: 'white !important'
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    text: {
                        color: 'white'
                    },
                    contained: {
                        color: 'white',
                        fontWeight: 'bold'
                    }
                }
            },
            MuiAutocomplete: {
                styleOverrides: {
                    listbox: {
                        padding: 0,
                        border: `solid 2px ${blueDark[900]}`,
                        borderTop: 'none'
                    }
                }
            },
            MuiList: {
                styleOverrides: {
                    root: {
                        padding: 0
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
