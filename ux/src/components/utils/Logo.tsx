import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@mui/styles';


interface LogoProps {
    className?: string;

    [key: string]: any;
}

const useStyles = makeStyles(theme => ({
    root: {
        transform: 'scale(1.25)',
        '& polygon': {
            fill: `${
                theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.text.primary
            } !important`
        },
        '& polygon.line': {
            fill: `${
                theme.palette.mode === 'dark' ? theme.palette.primary[600] : theme.palette.text.primary
            } !important`
        }
    }
}));

const Logo: FC<LogoProps> = ({ className, ...rest }) => {
    const classes = useStyles();

    return (
        <svg
            className={clsx(classes.root, className)}
            width="42px"
            height="43px"
            viewBox="0 0 42 43"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <title>Logo</title>
            <desc>Datatensor logo.</desc>
            <g id="Landing" stroke="none" fill="none">
                <g id="Landing-page" transform="translate(-31.000000, -11.000000)">
                    <g id="topbar">
                        <g id="left" transform="translate(32.000000, 12.000000)">
                            <g id="Logo">
                                <g id="Oval">
                                    <use fill="black" filter="url(#filter-2)" />
                                    <use fill="#FFFFFF"/>
                                </g>
                                <polygon
                                    id="Path"
                                    fill="#121212"
                                    points="19.1666667 20.4166667 15.0651337 27.9074606 12.5504664 32.5 12.514661 32.5 10.992333 29.7198264 10 27.9074606 10.0355213 27.9074606 14.1373574 20.4166667 10.0355213 12.9258928 10 12.9258928 10.992333 11.1135405 12.514661 8.33333333 12.5504664 8.33333333 15.0651337 12.9258928" />
                                <polygon id="Path" fill="#272727"
                                         points="33.3333333 20.4166667 26.430165 32.5 12.6237354 32.5 11.0353756 29.7198264 10 27.9074606 23.8060709 27.9074606 28.0858759 20.4166667 23.8060709 12.9258928 10 12.9258928 11.0353756 11.1135405 12.6237354 8.33333333 26.430165 8.33333333" />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export default Logo;
