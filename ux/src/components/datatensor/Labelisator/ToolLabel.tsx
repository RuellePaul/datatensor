import React, {FC, useRef, useState} from 'react';
import {v4 as uuid} from 'uuid';
import {Label} from 'src/types/label';
import {Point} from 'src/types/point';
import {makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {
    CANVAS_OFFSET,
    LABEL_MIN_WIDTH,
    LABEL_MIN_HEIGHT,
    currentLabelsHoverIds,
    currentPoint,
    drawCursorLines,
    drawRect,
    formatRatio,
    pointIsOutside,
    reset
} from 'src/utils/labeling';

interface ToolLabelProps {
    labels: Label[];
    setLabels: (labels: Label[]) => void;
    setTool: (tool) => void;
    autoSwitch: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    canvas: {
        position: 'absolute',
        top: -CANVAS_OFFSET,
        left: -CANVAS_OFFSET,
        width: `calc(100% + ${2 * CANVAS_OFFSET}px)`,
        height: `calc(100% + ${2 * CANVAS_OFFSET}px)`,
        zIndex: 1000
    }
}));

const ToolLabel: FC<ToolLabelProps> = ({labels, setLabels, setTool, autoSwitch}) => {

    const classes = useStyles();
    const canvasRef = useRef(null);

    const [storedPoint, setStoredPoint] = useState<Point>(null);

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let canvas = canvasRef.current;
        reset(canvas);

        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 0) {  // IDLE
            let labelsHoverIds = currentLabelsHoverIds(canvas, point, labels);
            if (autoSwitch && labelsHoverIds.length > 0) {
                setTool('move');
                return;
            }
            drawCursorLines(canvas, point);
        }

        if (event.nativeEvent.which === 1)  // START DRAW LABEL
            drawRect(canvas, point, storedPoint)
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLCanvasElement>) => {
        reset(canvasRef.current);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let point = currentPoint(event.nativeEvent);
        if (pointIsOutside(canvasRef.current, point))
            return;
        if (event.nativeEvent.which === 1) {
            setStoredPoint(point);
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (event.nativeEvent.which === 1) {
            if (!storedPoint) return;

            let point = currentPoint(event.nativeEvent);
            if (pointIsOutside(canvasRef.current, point))
                return;
            let canvas = canvasRef.current;
            if (canvas === null) return;
            if (Math.abs(storedPoint[0] - point[0]) < LABEL_MIN_WIDTH) return;
            if (Math.abs(storedPoint[1] - point[1]) < LABEL_MIN_HEIGHT) return;
            let newLabel = {
                id: uuid(),
                x: formatRatio(Math.min(point[0] - CANVAS_OFFSET, storedPoint[0] - CANVAS_OFFSET) / (canvas.width - 2 * CANVAS_OFFSET)),
                y: formatRatio(Math.min(point[1] - CANVAS_OFFSET, storedPoint[1] - CANVAS_OFFSET) / (canvas.height - 2 * CANVAS_OFFSET)),
                w: formatRatio((point[0] - storedPoint[0]) / (canvas.width - 2 * CANVAS_OFFSET)),
                h: formatRatio((point[1] - storedPoint[1]) / (canvas.height - 2 * CANVAS_OFFSET))
            };
            setLabels([...labels, newLabel]);
        }
    };

    return (
        <canvas
            className={classes.canvas}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={canvasRef}
        />
    )
};

export default ToolLabel;