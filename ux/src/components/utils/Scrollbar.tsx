import React, {FC} from 'react';
import {Scrollbars} from 'rc-scrollbars';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';

interface ScrollbarProps {}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    track: {},
    thumb: {
        backgroundColor: '#6b6b6b !important'
    },
    hide: {
        display: 'none'
    }
}));

const Scrollbar: FC<ScrollbarProps> = ({children, ...rest}) => {
    const classes = useStyles();

    return (
        <Scrollbars
            classes={{
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
