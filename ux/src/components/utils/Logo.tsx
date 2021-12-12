import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@mui/styles';

interface LogoProps {
    className?: string;

    [key: string]: any;
}

const useStyles = makeStyles(theme => ({
    root: {
        animation: 'fadein 0.75s',
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

const Logo: FC<LogoProps> = ({className, ...rest}) => {
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
                <g id="Landing-page">
                    <g id="topbar">
                        <g id="left">
                            <g id="Logo">
                                <polygon className="line">
                                    <animate
                                        attributeName="points"
                                        dur="0.75s"
                                        fill="freeze"
                                        from="19.1666667 0 15.0651337 0 12.5504664 0 12.514661 32.5 0 29.7198264 0 27.9074606 0 27.9074606 0 20.4166667 0 12.9258928 0 12.9258928 0 11.1135405 0 8.33333333 0 8.33333333 0 12.9258928"
                                        to="19.1666667 20.4166667 15.0651337 27.9074606 12.5504664 32.5 12.514661 32.5 10.992333 29.7198264 10 27.9074606 10.0355213 27.9074606 14.1373574 20.4166667 10.0355213 12.9258928 10 12.9258928 10.992333 11.1135405 12.514661 8.33333333 12.5504664 8.33333333 15.0651337 12.9258928"
                                    />
                                </polygon>
                                <polygon>
                                    <animate
                                        attributeName="points"
                                        dur="0.75s"
                                        fill="freeze"
                                        from="33.3333333 0 26.430165 0 12.6237354 0 11.0353756 0 10 0 23.8060709 0 28.0858759 0 23.8060709 0 10 0 11.0353756 0 12.6237354 0 26.430165 0"
                                        to="33.3333333 20.4166667 26.430165 32.5 12.6237354 32.5 11.0353756 29.7198264 10 27.9074606 23.8060709 27.9074606 28.0858759 20.4166667 23.8060709 12.9258928 10 12.9258928 11.0353756 11.1135405 12.6237354 8.33333333 26.430165 8.33333333"
                                    />
                                </polygon>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export default Logo;
