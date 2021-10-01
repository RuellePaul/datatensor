import _ from 'lodash';
import {
    createTheme as createMuiTheme,
    responsiveFontSizes
} from '@mui/material';
import {Theme as MuiTheme} from '@mui/material/styles';
import {THEMES} from 'src/constants';
import typography from './typography';

export interface Theme extends MuiTheme {
    name: string;
}

type Direction = 'ltr' | 'rtl';

interface ThemeConfig {
    direction?: Direction;
    theme?: string;
}

const baseOptions: any = {
    direction: 'ltr',
    typography,
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1320,
            xl: 1920
        }
    },
    overrides: {
        MuiLinearProgress: {
            root: {
                borderRadius: 3,
                overflow: 'hidden'
            }
        },
        MuiListItemIcon: {
            root: {
                minWidth: 32
            }
        },
        MuiChip: {
            root: {
                backgroundColor: 'rgba(0,0,0,0.075)'
            }
        }
    }
};

const themesOptions: any[] = [
    {
        name: THEMES.LIGHT
    },
    {
        name: THEMES.DARK,
        palette: {
            mode: 'dark'
        }
    },
    {
        name: THEMES.UNICORN,
        palette: {
            mode: 'dark'
        }
    }
];

export const createTheme = (config: ThemeConfig = {}): Theme => {
    let themeOptions = themesOptions.find(theme => theme.name === config.theme);

    if (!themeOptions) {
        console.warn(new Error(`The theme ${config.theme} is not valid`));
        [themeOptions] = themesOptions;
    }

    let theme = createMuiTheme(
        _.merge({}, baseOptions, themeOptions, {direction: config.direction})
    );

    theme = responsiveFontSizes(theme);

    return theme as Theme;
};
