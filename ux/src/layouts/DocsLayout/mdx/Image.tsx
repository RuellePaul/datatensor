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

const Image: FC = (props) => {
    const classes = useStyles();

    const imageRef = useRef();

    const handleFullScreen = () => {
        requestFullScreen(imageRef.current)
    }

    return (  // eslint-disable-next-line
        <img
            className={classes.root}
            onDoubleClick={handleFullScreen}
            draggable={false}
            ref={imageRef}
            {...props}
        />
    );
};

export default Image;
