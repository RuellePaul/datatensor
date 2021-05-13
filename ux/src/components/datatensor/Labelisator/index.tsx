import React, {FC} from 'react';
import useEventListener from 'use-typed-event-listener';
import {makeStyles} from '@material-ui/core';
import DTImage from 'src/components/datatensor/Image';
import ToolLabel from './ToolLabel';
import ToolMove from './ToolMove';
import {Theme} from 'src/theme';
import {CANVAS_OFFSET} from 'src/utils/labeling';
import useImages from 'src/hooks/useImages';
import useImage from 'src/hooks/useImage';

interface DTLabelisatorProps {
    tool: 'label' | 'move';
    setTool: any;
    autoSwitch: boolean;
    selected: number;
    setSelected: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        margin: `${CANVAS_OFFSET}px auto`
    },
}));


const DTLabelisator: FC<DTLabelisatorProps> = ({
                                                   autoSwitch,
                                                   tool,
                                                   setTool,
                                                   selected,
                                                   setSelected
                                               }) => {
    const classes = useStyles();

    const {images} = useImages();
    const {image, validateLabels, previousPosition} = useImage();

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'a') {
            setTool('label')
        } else if (!event.ctrlKey && event.key === 'z') {
            setTool('move')
        } else if (event.key === 'ArrowLeft') {
            if (selected === 0) return;
            setSelected(selected - 1);
        } else if (event.key === 'ArrowRight') {
            if (selected === images.length - 1) return;
            setSelected(selected + 1);
        } else if (event.key === ' ') {
            validateLabels();
            if (selected === images.length - 1) return;
            setSelected(selected + 1);
        } else if (event.ctrlKey && event.key === 'z') {
            previousPosition()
        }
    };

    useEventListener(window, 'keydown', handleKeyDown);

    return (
        <div
            className={classes.root}
            style={{maxWidth: 700 * image.width / image.height}}
        >
            {tool === 'label' && (
                <ToolLabel
                    setTool={setTool}
                    autoSwitch={autoSwitch}
                />
            )}
            {tool === 'move' && (
                <ToolMove
                    setTool={setTool}
                    autoSwitch={autoSwitch}
                />
            )}
            <DTImage/>
        </div>
    );
};

export default DTLabelisator;
