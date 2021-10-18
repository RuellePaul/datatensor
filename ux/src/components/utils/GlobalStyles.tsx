import {FC} from 'react';
import createStyles from '@mui/styles/createStyles';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        '@global': {
            '*': {
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
                fontFamily: theme.typography.fontFamily
            },
            html: {
                '-webkit-font-smoothing': 'antialiased',
                '-moz-osx-font-smoothing': 'grayscale',
                height: '100%',
                width: '100%'
            },
            body: {
                height: '100%',
                width: '100%'
            },
            '#root': {
                overflow: 'auto',
                height: '100%',
                width: '100%'
            },
            '.scroll': {
                overflowY: 'auto',
                height: '100%',

                '&::-webkit-scrollbar': {
                    width: '0.4em'
                },
                '&::-webkit-scrollbar-track': {
                    boxShadow: `inset 0 0 6px ${theme.palette.primary.main}`,
                    webkitBoxShadow: `inset 0 0 6px ${theme.palette.primary.main}`
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: `${theme.palette.primary.main}`,
                    outline: '1px solid slategrey'
                }
            }
        }
    })
);

const GlobalStyles: FC = () => {
    useStyles();

    return null;
};

export default GlobalStyles;
