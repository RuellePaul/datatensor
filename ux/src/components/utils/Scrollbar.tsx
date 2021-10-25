import React, {FC} from 'react';
import clsx from 'clsx';
import {Scrollbars} from 'rc-scrollbars';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';

interface ScrollbarProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    track: {},
    view: {
        position: 'relative'
    },
    thumb: {
        backgroundColor: '#6b6b6b !important'
    },
    hide: {
        display: 'none'
    }
}));

const Scrollbar: FC<ScrollbarProps> = ({children, className, ...rest}) => {
    const classes = useStyles();

    return (
        <Scrollbars
            classes={{
                view: clsx(classes.view, className),
                trackHorizontal: classes.hide,
                thumbHorizontal: classes.hide,
                trackVertical: classes.track,
                thumbVertical: classes.thumb
            }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            renderTrackVertical={props => <div {...props} className={classes.track} />}
        >
            {children}
        </Scrollbars>
    );
};

export default Scrollbar;
