import {createMuiTheme, responsiveFontSizes} from '@material-ui/core';

import palette from './palette';

let build = (theme: 'light' | 'dark') => createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 700,
            md: 1050,
            lg: 1280,
            xl: 1920,
        },
    },
    spacing: 8,
    palette: {
        ...palette,
        type: theme
    }
});

let light = build('light');
let dark = build('dark');

light = responsiveFontSizes(light);
dark = responsiveFontSizes(dark);

const themes = {
    light,
    dark
};

export default themes;
