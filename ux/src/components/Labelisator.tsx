import React, {FC, useRef} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import {Theme} from 'src/theme';
import DTImage from 'src/components/Image';
import useImages from 'src/hooks/useImages';

interface DTLabelisatorProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    container: {
        position: 'relative',
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        cursor: 'crosshair'
    }
}));

const currentOffset = (event) => ([event.offsetX, event.offsetY]);

const reset = (canvas) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};

const drawCursorLines = (canvas, offset) => {
    let context = canvas.getContext('2d');
    context.beginPath();
    context.setLineDash([5]);
    context.moveTo(offset[0], 0);
    context.lineTo(offset[0], 720);
    context.moveTo(0, offset[1]);
    context.lineTo(1280, offset[1]);
    context.stroke();
};

const Tools = () => {
    const [tool, setTool] = React.useState<string | null>('label');

    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
        if (newTool !== null)
            setTool(newTool);
    };

    return (
        <ToggleButtonGroup
            value={tool}
            exclusive
            onChange={handleToolChange}
        >
            <ToggleButton value="label">
                <LabelIcon/>
            </ToggleButton>
            <ToggleButton value="move">
                <MoveIcon/>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

const DTLabelisator: FC<DTLabelisatorProps> = ({
                                                   className,
                                                   ...rest
                                               }) => {
    const classes = useStyles();

    const canvasRef = useRef();

    const {images} = useImages();

    const handleMouseMove = (event) => {
        reset(canvasRef.current);
        let offset = currentOffset(event.nativeEvent);
        drawCursorLines(canvasRef.current, offset);
    };

    const handleMouseLeave = (event) => {
        reset(canvasRef.current);
    };

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Tools/>

            <div className={classes.container}>
                <canvas
                    className={classes.canvas}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={canvasRef}
                />
                <DTImage
                    image={images[0]}
                />
            </div>
        </div>
    );
};

export default DTLabelisator;
