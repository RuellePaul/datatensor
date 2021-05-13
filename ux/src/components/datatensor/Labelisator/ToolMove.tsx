import React, {FC, useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core';
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
    drawLabels,
    renderCursor,
    reset
} from 'src/utils/labeling';
import useImage from 'src/hooks/useImage';

interface ToolMoveProps {
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

const ToolMove: FC<ToolMoveProps> = ({setTool, autoSwitch}) => {

    const classes = useStyles();

    const {categories} = useDataset();
    const {labels, saveLabels} = useImage();

    const canvasRef = useRef<HTMLCanvasElement>();

    const [direction, setDirection] = useState<Direction>(null);

    const [storedPoint, setStoredPoint] = useState<Point>(null);
    const [storedLabels, setStoredLabels] = useState<Label[]>([]);

    useEffect(() => {
        if (direction === "top-left" || direction === "bottom-right")
            canvasRef.current.style.cursor = 'nwse-resize';
        else if (direction === "top-right" || direction === "bottom-left")
            canvasRef.current.style.cursor = 'nesw-resize';
    }, [direction]);


    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let point = currentPoint(event.nativeEvent);

        let canvas = canvasRef.current;
        reset(canvas);

        if (event.nativeEvent.which === 1) {
            let labelsHoverIds = currentLabelsHoverIds(canvasRef.current, point, labels);
            if (labelsHoverIds.length > 0) {
                setStoredPoint(point);
                renderCursor(canvas, point, labels, (resizeLabel, direction) => {
                    setDirection(direction);
                    if (resizeLabel === null && direction === null) {
                        saveLabels(labels.filter(label => !labelsHoverIds.includes(label._id)));
                        setStoredLabels(labels.filter(label => labelsHoverIds.includes(label._id)));
                        drawLabels(canvas, labels.filter(label => labelsHoverIds.includes(label._id)), categories, CANVAS_OFFSET, 5, true, true);
                    } else {
                        saveLabels(labels.filter(label => label._id !== resizeLabel._id));
                        setStoredLabels(labels.filter(label => label._id === resizeLabel._id));
                        drawLabels(canvas, labels.filter(label => label._id === resizeLabel._id), categories, CANVAS_OFFSET, 5, true, true);
                    }
                });
            }
        }
        if (event.nativeEvent.which === 3) {
            let labelsHoverIds = currentLabelsHoverIds(canvasRef.current, point, labels);
            setStoredLabels(labels.filter(label => labelsHoverIds.includes(label._id)));
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let canvas = canvasRef.current;
        reset(canvas);
        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 0) { // IDLE
            let labelsHoverIds = currentLabelsHoverIds(canvas, point, labels);
            if (autoSwitch && labelsHoverIds.length === 0) {
                setTool('label');
                return;
            }
            drawLabels(canvas, labels.filter(label => labelsHoverIds.includes(label._id)), categories, CANVAS_OFFSET, 5, true, true);
            renderCursor(canvas, point, labels, (label, direction) => setDirection(direction));
            if (direction === null)
                if (labelsHoverIds.length === 0)
                    canvas.style.cursor = 'initial';
                else
                    canvas.style.cursor = 'move';
        }

        if (event.nativeEvent.which === 1) { // START MOVE
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

        if (event.nativeEvent.which === 1) { // LEFT CLICK
            if (!storedPoint || !storedLabels) return;
            if (storedLabels.length === 0) return;

            if (direction === null) {
                let labelsTranslated = currentLabelsTranslated(canvas, storedLabels, point, storedPoint);
                saveLabels([...labels, ...labelsTranslated]);
            } else {
                let labelsResized = currentLabelsResized(canvas, storedLabels, point, storedPoint, direction, true);
                saveLabels([...labels, ...labelsResized]);
            }

            setStoredPoint(null);
            setStoredLabels([]);
        }
    };

    const [contextMenuPoint, setContextMenuPoint] = useState<Point>([null, null]);
    const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setContextMenuPoint([event.clientX, event.clientY]);
    };

    const handleClose = () => {
        setContextMenuPoint([null, null]);
    };


    return (
        <>
            <canvas
                className={classes.canvas}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onContextMenu={handleContextMenu}
                ref={canvasRef}
            />
            <ContextMenu
                canvas={canvasRef.current}
                selectedLabels={storedLabels}
                point={contextMenuPoint}
                handleClose={handleClose}
            />
        </>
    )
};

export default ToolMove;