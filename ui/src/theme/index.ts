import {createMuiTheme, responsiveFontSizes} from '@material-ui/core';

import palette from './palette';

let theme = createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 700,
            md: 1000,
            lg: 1280,
            xl: 1920,
        },
    },
    spacing: 8,
    // @ts-ignore
    palette
});

theme = responsiveFontSizes(theme);

export default theme;
