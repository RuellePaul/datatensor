import {createMuiTheme} from '@material-ui/core';

import palette from './palette';

const theme = createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 700,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    spacing: 8,
    // @ts-ignore
    palette
});

export default theme;
