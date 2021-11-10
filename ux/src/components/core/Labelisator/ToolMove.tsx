import React, {FC, useEffect, useRef, useState} from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ContextMenu from './ContextMenu';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import {Direction} from 'src/types/direction';
import {Label} from 'src/types/label';
import {Point} from 'src/types/point';
import {
    CANVAS_OFFSET,
    currentLabelsHoverIds,
    currentLabelsResized,
    currentLabelsTranslated,
    currentPoint,
    distance,
    drawLabels,
    renderCursor,
    reset
} from 'src/utils/labeling';
import useImage from 'src/hooks/useImage';

interface ToolMoveProps {
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

const ToolMove: FC<ToolMoveProps> = ({setTool, autoSwitch}) => {
    const classes = useStyles();

    const {categories} = useDataset();
    const {image, labels, saveLabels, storePosition} = useImage();

    const canvasRef = useRef<HTMLCanvasElement>();

    const [direction, setDirection] = useState<Direction>(null);

    const [storedPoint, setStoredPoint] = useState<Point>(null);
    const [storedLabels, setStoredLabels] = useState<Label[]>([]);

    useEffect(() => {
        if (direction === 'top-left' || direction === 'bottom-right') canvasRef.current.style.cursor = 'nwse-resize';
        else if (direction === 'top-right' || direction === 'bottom-left')
            canvasRef.current.style.cursor = 'nesw-resize';
    }, [direction]);

    useEffect(() => {
        reset(canvasRef.current);
    }, [image.id]);

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let point = currentPoint(event.nativeEvent);

        let canvas = canvasRef.current;

        if (event.nativeEvent.which === 1) {
            reset(canvas);

            let labelsHoverIds = currentLabelsHoverIds(canvasRef.current, point, labels);
            if (labelsHoverIds.length > 0) {
                setStoredPoint(point);
                renderCursor(canvas, point, labels, (resizeLabel, direction) => {
                    setDirection(direction);
                    if (resizeLabel === null && direction === null) {
                        saveLabels(labels.filter(label => !labelsHoverIds.includes(label.id)));
                        setStoredLabels(labels.filter(label => labelsHoverIds.includes(label.id)));
                        drawLabels(
                            canvas,
                            labels.filter(label => labelsHoverIds.includes(label.id)),
                            categories,
                            CANVAS_OFFSET,
                            5,
                            true,
                            true
                        );
                    } else {
                        saveLabels(labels.filter(label => label.id !== resizeLabel.id));
                        setStoredLabels(labels.filter(label => label.id === resizeLabel.id));
                        drawLabels(
                            canvas,
                            labels.filter(label => label.id === resizeLabel.id),
                            categories,
                            CANVAS_OFFSET,
                            5,
                            true,
                            true
                        );
                    }
                });
            }
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let canvas = canvasRef.current;
        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 0) {
            reset(canvas);

            // IDLE
            let labelsHoverIds = currentLabelsHoverIds(canvas, point, labels);
            if (autoSwitch && labelsHoverIds.length === 0) {
                setTool('label');
                return;
            }
            drawLabels(
                canvas,
                labels.filter(label => labelsHoverIds.includes(label.id)),
                categories,
                CANVAS_OFFSET,
                0,
                true,
                true
            );
            renderCursor(canvas, point, labels, (label, direction) => setDirection(direction));
            if (direction === null)
                if (labelsHoverIds.length === 0) canvas.style.cursor = 'initial';
                else canvas.style.cursor = 'move';
        }

        if (event.nativeEvent.which === 1) {
            reset(canvas);

            // START MOVE
            if (storedLabels.length === 0) return;
            if (direction === null) {
                let labelsTranslated = currentLabelsTranslated(canvas, storedLabels, point, storedPoint);
                drawLabels(canvas, labelsTranslated, categories, CANVAS_OFFSET, 5, true, true);
            } else {
                let labelsResized = currentLabelsResized(canvas, storedLabels, point, storedPoint, direction);
                drawLabels(canvas, labelsResized, categories, CANVAS_OFFSET, 5, true, true);
            }
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let canvas = canvasRef.current;
        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 1) {
            // LEFT CLICK
            if (!storedPoint || !storedLabels) return;
            if (storedLabels.length === 0) return;

            if (direction === null) {
                let labelsTranslated = currentLabelsTranslated(canvas, storedLabels, point, storedPoint);
                saveLabels([...labels, ...labelsTranslated]);
                storePosition([...labels, ...labelsTranslated]);
            } else {
                let labelsResized = currentLabelsResized(canvas, storedLabels, point, storedPoint, direction, true);
                saveLabels([...labels, ...labelsResized]);
                storePosition([...labels, ...labelsResized]);
            }

            setStoredPoint(null);
            setStoredLabels([]);
        }
    };

    const [contextMenuPoint, setContextMenuPoint] = useState<Point>([null, null]);
    const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setContextMenuPoint([event.clientX, event.clientY]);
        let point = currentPoint(event.nativeEvent);
        setStoredPoint(point);
        let labelsHoverIds = currentLabelsHoverIds(canvasRef.current, point, labels);
        setStoredLabels(labels.filter(label => labelsHoverIds.includes(label.id)));
    };

    const handleClose = () => {
        setContextMenuPoint([null, null]);
        setStoredLabels([]);
        reset(canvasRef.current);
    };

    const [lastPoint, setLastPoint] = useState<Point>(null);

    const handleTouch = (event: React.UIEvent<HTMLCanvasElement>) => {
        const touchEvent = event.nativeEvent as TouchEvent;
        const touches = touchEvent.changedTouches;

        if (touches.length === 1) {
            if (storedLabels.length === 0) return;

            const canvas = canvasRef.current;
            if (canvas === null) return;

            const offsetX = canvas.getBoundingClientRect().left;
            const offsetY = canvas.getBoundingClientRect().top;

            const point = [touches[0].pageX - offsetX, touches[0].pageY - offsetY];
            setLastPoint(point);

            if (distance(lastPoint, storedPoint) > 20) setContextMenuPoint([null, null]);

            let labelsTranslated = currentLabelsTranslated(canvas, storedLabels, point, storedPoint);
            reset(canvas);
            drawLabels(canvas, labelsTranslated, categories, CANVAS_OFFSET, 5, true, true);
        }
    };

    const handleTouchEnd = (event: React.UIEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas === null) return;
        reset(canvas);

        if (!storedPoint || !storedLabels) return;
        if (storedLabels.length === 0) return;

        if (distance(lastPoint, storedPoint) > 20) handleClose();

        setLastPoint(null);

        let labelsTranslated = currentLabelsTranslated(canvas, storedLabels, lastPoint, storedPoint);
        saveLabels([
            ...labels.filter(label => !labelsTranslated.map(label => label.id).includes(label.id)),
            ...labelsTranslated
        ]);
        storePosition([
            ...labels.filter(label => !labelsTranslated.map(label => label.id).includes(label.id)),
            ...labelsTranslated
        ]);
    };

    return (
        <>
            <canvas
                className={classes.canvas}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouch}
                onTouchMove={handleTouch}
                onTouchEnd={handleTouchEnd}
                ref={canvasRef}
            />
            <ContextMenu
                canvas={canvasRef.current}
                selectedLabels={storedLabels}
                point={contextMenuPoint}
                handleClose={handleClose}
            />
        </>
    );
};

export default ToolMove;
