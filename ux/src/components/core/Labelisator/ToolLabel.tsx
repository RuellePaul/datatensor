import React, {FC, useRef, useState} from 'react';
import clsx from 'clsx';
import {v4 as uuid} from 'uuid';
import {useSnackbar} from 'notistack';
import {Point} from 'src/types/point';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {
    CANVAS_OFFSET,
    currentLabelsHoverIds,
    currentPoint,
    drawCursorLines,
    drawRect,
    formatRatio,
    LABEL_MIN_HEIGHT,
    LABEL_MIN_WIDTH,
    pointIsOutside,
    reset
} from 'src/utils/labeling';
import useCategory from 'src/hooks/useCategory';
import useImage from 'src/hooks/useImage';

interface ToolLabelProps {
    setTool: any;
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

const ToolLabel: FC<ToolLabelProps> = ({setTool, autoSwitch}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const canvasRef = useRef(null);

    const {labels, saveLabels, storePosition} = useImage();
    const {currentCategory} = useCategory();

    const [storedPoint, setStoredPoint] = useState<Point>(null);

    const handleMouseLeave = (event: React.MouseEvent<HTMLCanvasElement>) => {
        reset(canvasRef.current);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let point = currentPoint(event.nativeEvent);
        if (pointIsOutside(canvasRef.current, point)) return;
        if (event.nativeEvent.which === 1) {
            setStoredPoint(point);
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let canvas = canvasRef.current;
        reset(canvas);

        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 0) {
            // IDLE
            let labelsHoverIds = currentLabelsHoverIds(canvas, point, labels);
            if (autoSwitch && labelsHoverIds.length > 0) {
                setTool('move');
                return;
            }
            drawCursorLines(canvas, point);
        }

        if (event.nativeEvent.which === 1)
            // START DRAW LABEL
            drawRect(canvas, point, storedPoint);
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (event.nativeEvent.which === 1) {
            if (!storedPoint) return;

            let point = currentPoint(event.nativeEvent);
            if (pointIsOutside(canvasRef.current, point)) return;
            let canvas = canvasRef.current;
            if (canvas === null) return;
            if (Math.abs(storedPoint[0] - point[0]) < LABEL_MIN_WIDTH) return;
            if (Math.abs(storedPoint[1] - point[1]) < LABEL_MIN_HEIGHT) return;
            let newLabel = {
                id: uuid(),
                x: formatRatio(
                    Math.min(point[0] - CANVAS_OFFSET, storedPoint[0] - CANVAS_OFFSET) /
                        (canvas.width - 2 * CANVAS_OFFSET)
                ),
                y: formatRatio(
                    Math.min(point[1] - CANVAS_OFFSET, storedPoint[1] - CANVAS_OFFSET) /
                        (canvas.height - 2 * CANVAS_OFFSET)
                ),
                w: formatRatio((point[0] - storedPoint[0]) / (canvas.width - 2 * CANVAS_OFFSET)),
                h: formatRatio((point[1] - storedPoint[1]) / (canvas.height - 2 * CANVAS_OFFSET)),
                category_id: currentCategory?.id || null
            };
            let newLabels = [...labels, newLabel];
            saveLabels(newLabels);
            storePosition(newLabels);
        }
    };

    const [touchesCount, setTouchesCount] = useState(0);

    const handleTouch = (event: React.UIEvent<HTMLCanvasElement>) => {
        const touchEvent = event.nativeEvent as TouchEvent;
        const touches = touchEvent.changedTouches;

        setTouchesCount(touches.length);

        if (touches.length <= 1) {

        } else if (touches.length === 2) {
            const canvas = canvasRef.current;
            if (canvas === null) return;

            const offsetX = canvas.getBoundingClientRect().left;
            const offsetY = canvas.getBoundingClientRect().top;

            const pointA = [touches[0].pageX - offsetX, touches[0].pageY - offsetY];
            const pointB = [touches[1].pageX - offsetX, touches[1].pageY - offsetY];

            reset(canvas);
            drawRect(canvas, pointB, pointA);
        } else {
            enqueueSnackbar('Labelisator only handles 2 touch point', {variant: 'warning'});
        }
    };

    return (
        <canvas
            className={clsx(classes.canvas, touchesCount === 2 && 'noTouch')}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouch}
            onTouchMove={handleTouch}
            ref={canvasRef}
        />
    );
};

export default ToolLabel;
