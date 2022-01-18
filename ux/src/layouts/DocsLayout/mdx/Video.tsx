import type {FC} from 'react';
import React, {useRef} from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import requestFullScreen from 'src/utils/requestFullScreen';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'block',
        margin: '24px auto',
        width: '100%',
        maxWidth: 700,
        border: `solid 1px ${theme.palette.divider}`
    }
}));

const Video: FC = (props) => {
    const classes = useStyles();

    const videoRef = useRef();

    const handleFullScreen = () => {
        requestFullScreen(videoRef.current)
    }

    return (  // eslint-disable-next-line
        <video
            className={classes.root}
            onDoubleClick={handleFullScreen}
            draggable={false}
            ref={videoRef}
            autoPlay
            loop
            {...props}
        />
    );
};

export default Video;
