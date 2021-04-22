import React, {FC, useRef, useState} from 'react';
import clsx from 'clsx';
import {Box, makeStyles} from '@material-ui/core';
import {Pagination, ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import {Theme} from 'src/theme';
import DTImage from 'src/components/Image';
import useImages from 'src/hooks/useImages';

interface DTLabelisatorProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        outline: 'none'
    },
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
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(1, 2)
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
    context.lineTo(offset[0], canvas.height);
    context.moveTo(0, offset[1]);
    context.lineTo(canvas.width, offset[1]);
    context.stroke();
};

const drawRect = (canvas, offsetA, offsetB) => {
    if (!offsetA || !offsetB)
        return;
    let x = offsetA[0];
    let y = offsetA[1];
    let w = offsetB[0] - offsetA[0];
    let h = offsetB[1] - offsetA[1];
    let color = '#000000';
    let context = canvas.getContext('2d');
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.strokeRect(x, y, w, h);
    context.fillStyle = `${color}33`;
    context.fillRect(x, y, w, h);
};


const Tools = () => {
    const [tool, setTool] = React.useState<string | null>('label');

    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
        if (newTool !== null)
            setTool(newTool);
    };

    return (
        <Box mb={1}>
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
        </Box>
    );
};

const DTLabelisator: FC<DTLabelisatorProps> = ({
                                                   className,
                                                   ...rest
                                               }) => {
    const classes = useStyles();

    const canvasRef = useRef();

    const {images} = useImages();

    const [selected, setSelected] = useState(0);

    const handleKeyDown = (event: React.KeyboardEvent<unknown>) => {
        if (event.key === 'ArrowLeft')
            setSelected(Math.max(0, selected - 1));
        else if (event.key === 'ArrowRight')
            setSelected(Math.min(selected + 1, images.length - 1));
    };

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelected(value - 1);
    };

    // canvas related
    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        reset(canvasRef.current);
        let offset = currentOffset(event.nativeEvent);

        if (event.nativeEvent.which === 0)  // IDLE
            drawCursorLines(canvasRef.current, offset);

        if (event.nativeEvent.which === 1)  // LEFT CLICK
            drawRect(canvasRef.current, offset, storeOffset)
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        reset(canvasRef.current);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        if (event.nativeEvent.which === 1)
            storeOffset = currentOffset(event.nativeEvent);
    };

    let storeOffset;

    return (
        <div
            className={clsx(classes.root, className)}
            onKeyDown={handleKeyDown}
            tabIndex={1000}
            {...rest}
        >
            <Tools/>

            <div
                className={classes.container}
            >
                <canvas
                    className={classes.canvas}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={canvasRef}
                />
                <DTImage
                    image={images[selected]}
                />
            </div>

            <Pagination
                className={classes.pagination}
                color='primary'
                count={images.length}
                page={selected + 1}
                onChange={handlePaginationChange}
            />
        </div>
    );
};

export default DTLabelisator;
