import React, {FC, useEffect, useRef, useState} from 'react';
import {Box, Button, Hidden, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {TouchApp as TouchIcon} from '@mui/icons-material';
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
    currentSmallestLabelHoverIds,
    distance,
    drawLabels,
    drawRect,
    formatRatio,
    LABEL_MIN_HEIGHT,
    LABEL_MIN_WIDTH,
    pointIsOutside,
    renderCursor,
    reset
} from 'src/utils/labeling';
import useImage from 'src/hooks/useImage';
import useCategory from 'src/hooks/useCategory';
import {v4 as uuid} from 'uuid';
import Cookies from 'js-cookie';

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
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.65)',
        zIndex: 1025,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: theme.spacing(2, 3),
        backdropFilter: 'blur(3px)',
        color: 'white'
    }
}));

const ToolMove: FC<ToolMoveProps> = ({setTool, autoSwitch}) => {
    const classes = useStyles();

    const {categories} = useDataset();
    const {currentCategory} = useCategory();

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

            let labelsHoverIds = event.shiftKey
                ? currentLabelsHoverIds(canvas, point, labels)
                : currentSmallestLabelHoverIds(canvas, point, labels);
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
            let labelsHoverIds = event.shiftKey
                ? currentLabelsHoverIds(canvas, point, labels)
                : currentSmallestLabelHoverIds(canvas, point, labels);

            if (autoSwitch && labelsHoverIds.length === 0) {
                setTool('label');
                return;
            }
            if (labels === null) return;
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
        let canvas = canvasRef.current;
        let labelsHoverIds = event.shiftKey
            ? currentLabelsHoverIds(canvas, point, labels)
            : currentSmallestLabelHoverIds(canvas, point, labels);
        setStoredLabels(labels.filter(label => labelsHoverIds.includes(label.id)));
    };

    const handleClose = () => {
        setContextMenuPoint([null, null]);
        setStoredLabels([]);
        reset(canvasRef.current);
    };

    const [storedPointA, setStoredPointA] = useState<Point>(null);
    const [storedPointB, setStoredPointB] = useState<Point>(null);

    const handleTouch = (event: React.UIEvent<HTMLCanvasElement>) => {
        const touchEvent = event.nativeEvent as TouchEvent;
        const touches = touchEvent.changedTouches;

        const canvas = canvasRef.current;
        if (canvas === null) return;

        if (touches.length === 1) {
            if (storedLabels.length === 0) return;

            const offsetX = canvas.getBoundingClientRect().left;
            const offsetY = canvas.getBoundingClientRect().top;

            const point = [touches[0].pageX - offsetX, touches[0].pageY - offsetY];
            setLastPoint(point);

            if (distance(lastPoint, storedPoint) > 100) setContextMenuPoint([null, null]);

            let labelsTranslated = currentLabelsTranslated(canvas, storedLabels, point, storedPoint);
            reset(canvas);
            drawLabels(canvas, labelsTranslated, categories, CANVAS_OFFSET, 5, true, true);
        } else if (touches.length === 2) {
            const offsetX = canvas.getBoundingClientRect().left;
            const offsetY = canvas.getBoundingClientRect().top;

            const pointA = [touches[0].pageX - offsetX, touches[0].pageY - offsetY];
            const pointB = [touches[1].pageX - offsetX, touches[1].pageY - offsetY];
            setStoredPointA(pointA);
            setStoredPointB(pointB);

            reset(canvas);
            drawRect(canvas, pointB, pointA);
        }
    };

    const handleTouchEnd = (event: React.UIEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas === null) return;
        reset(canvas);

        if (storedLabels.length > 0) {
            if (!storedPoint || !storedLabels) return;
            if (storedLabels.length === 0) return;

            if (distance(lastPoint, storedPoint) > 100) handleClose();

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
        } else {
            if (!storedPointA) return;
            if (!storedPointB) return;

            if (pointIsOutside(canvas, storedPointA)) return;
            if (pointIsOutside(canvas, storedPointB)) return;
            if (Math.abs(storedPointB[0] - storedPointA[0]) < LABEL_MIN_WIDTH) return;
            if (Math.abs(storedPointB[1] - storedPointA[1]) < LABEL_MIN_HEIGHT) return;

            let newLabel = {
                id: uuid(),
                x: formatRatio(
                    Math.min(storedPointA[0] - CANVAS_OFFSET, storedPointB[0] - CANVAS_OFFSET) /
                        (canvas.width - 2 * CANVAS_OFFSET)
                ),
                y: formatRatio(
                    Math.min(storedPointA[1] - CANVAS_OFFSET, storedPointB[1] - CANVAS_OFFSET) /
                        (canvas.height - 2 * CANVAS_OFFSET)
                ),
                w: formatRatio((storedPointA[0] - storedPointB[0]) / (canvas.width - 2 * CANVAS_OFFSET)),
                h: formatRatio((storedPointA[1] - storedPointB[1]) / (canvas.height - 2 * CANVAS_OFFSET)),
                category_id: currentCategory?.id || null
            };
            let newLabels = [...labels, newLabel];
            saveLabels(newLabels);
            storePosition(newLabels);
            setStoredPointA(null);
            setStoredPointB(null);
        }
    };

    const [lastPoint, setLastPoint] = useState<Point>(null);

    const [openOverlay, setOpenOverlay] = useState<boolean>(!Boolean(Cookies.get('labelisatorTouchOverlay')));

    const handleCloseOverlay = () => {
        Cookies.set('labelisatorTouchOverlay', 'true');
        setOpenOverlay(false);
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
            {openOverlay && (
                <Hidden smUp>
                    <div className={classes.overlay} onClick={handleCloseOverlay}>
                        <Box mb={2}>
                            <Typography variant="h6" color="textPrimary" align="center" gutterBottom>
                                To start drawing labels, touch with two fingers.
                            </Typography>
                            <Typography variant="h6" color="textPrimary" align="center" gutterBottom>
                                To change a label, long-tap and drag it.
                            </Typography>
                        </Box>
                        <TouchIcon className="highlight" fontSize="large" />
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleCloseOverlay}
                            sx={{mt: 2}}
                            size="small"
                        >
                            Got it
                        </Button>
                    </div>
                </Hidden>
            )}
        </>
    );
};

export default ToolMove;
