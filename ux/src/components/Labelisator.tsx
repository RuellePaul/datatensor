import React, {FC, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import useEventListener from 'use-typed-event-listener';
import {useSnackbar} from 'notistack';
import {v4 as uuid} from 'uuid';
import {
    Box,
    Button,
    FormControlLabel,
    ListItemIcon,
    makeStyles,
    Menu,
    MenuItem,
    Switch,
    Tooltip,
    Typography
} from '@material-ui/core';
import {Pagination, ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Maximize as LabelIcon, Move as MoveIcon, Trash as DeleteIcon} from 'react-feather';
import {Theme} from 'src/theme';
import DTImage from 'src/components/Image';
import useImages from 'src/hooks/useImages';
import {Label} from 'src/types/label';
import {Image} from 'src/types/image';
import api from 'src/utils/api';

interface DTLabelisatorProps {
    className?: string;
}

interface ContextMenuProps {
    point: Point;
    handleClose: () => void;
}

interface ToolLabelProps {
    labels: Label[];
    setLabels: (labels: Label[]) => void;
    setTool: (tool) => void;
    autoSwitch: boolean;
}

interface ToolMoveProps {
    labels: Label[];
    setLabels: (labels: Label[]) => void;
    setTool: (tool) => void;
    autoSwitch: boolean;
}

type Direction = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right' | null;
type Point = number[];

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    container: {
        position: 'relative',
        margin: `${CANVAS_OFFSET}px auto`
    },
    canvas: {
        position: 'absolute',
        top: -CANVAS_OFFSET,
        left: -CANVAS_OFFSET,
        width: `calc(100% + ${2 * CANVAS_OFFSET}px)`,
        height: `calc(100% + ${2 * CANVAS_OFFSET}px)`,
        zIndex: 1000
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(2)
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(0, 0, 1)
    }
}));

const LABEL_MIN_WIDTH = 25;
const LABEL_MIN_HEIGHT = 25;
const CANVAS_OFFSET = 50;

const currentPoint = (nativeEvent) => ([nativeEvent.offsetX, nativeEvent.offsetY]);

const pointIsOutside = (canvas: HTMLCanvasElement, point: Point) => {
    if (point[0] < CANVAS_OFFSET || point[0] > canvas.width - CANVAS_OFFSET)
        return true;
    if (point[1] < CANVAS_OFFSET || point[1] > canvas.height - CANVAS_OFFSET)
        return true;
    return false
};

const reset = (canvas: HTMLCanvasElement) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};

const currentDelta = (canvas: HTMLCanvasElement, pointA: Point, pointB: Point) => {
    let delta: Point = [
        (pointA[0] - pointB[0]) / (canvas.width - 2 * CANVAS_OFFSET),
        (pointA[1] - pointB[1]) / (canvas.height - 2 * CANVAS_OFFSET)
    ];
    return delta
};

const convertLabel = (canvas: HTMLCanvasElement, label: Label) => {
    let x = CANVAS_OFFSET + label.x * (canvas.width - 2 * CANVAS_OFFSET);
    let y = CANVAS_OFFSET + label.y * (canvas.height - 2 * CANVAS_OFFSET);
    let w = label.w * (canvas.width - 2 * CANVAS_OFFSET);
    let h = label.h * (canvas.height - 2 * CANVAS_OFFSET);
    return {x, y, w, h}
};

const drawCursorLines = (canvas: HTMLCanvasElement, point: Point) => {
    canvas.style.cursor = 'initial';
    if (pointIsOutside(canvas, point))
        return;

    let context = canvas.getContext('2d');
    context.beginPath();
    context.setLineDash([5]);
    context.moveTo(point[0], CANVAS_OFFSET);
    context.lineTo(point[0], (canvas.height - CANVAS_OFFSET));
    context.moveTo(CANVAS_OFFSET, point[1]);
    context.lineTo((canvas.width - CANVAS_OFFSET), point[1]);
    context.stroke();
    canvas.style.cursor = 'crosshair';
};

const drawRect = (canvas: HTMLCanvasElement, pointA: Point, pointB: Point) => {
    if (!pointA || !pointB)
        return;
    if (pointIsOutside(canvas, pointA) || pointIsOutside(canvas, pointB))
        return;
    let x = pointA[0];
    let y = pointA[1];
    let w = pointB[0] - pointA[0];
    let h = pointB[1] - pointA[1];
    let color = (Math.abs(w) < LABEL_MIN_WIDTH || Math.abs(h) < LABEL_MIN_HEIGHT) ? '#FF0000' : '#FFFFFF';
    let context = canvas.getContext('2d');
    context.lineWidth = 2;
    context.setLineDash([5]);
    context.strokeStyle = color;
    context.strokeRect(x, y, w, h);
    context.fillStyle = `${color}08`;
    context.fillRect(x, y, w, h);
};

const RESIZE_SIZE = 8;

const drawLabels = (canvas: HTMLCanvasElement, labels: Label[]) => {
    if (!labels)
        return;
    for (const label of labels) {
        const {x, y, w, h} = convertLabel(canvas, label);
        let color = (Math.abs(w) < LABEL_MIN_WIDTH || Math.abs(h) < LABEL_MIN_HEIGHT) ? '#FF0000' : '#FFFFFF';
        let context = canvas.getContext('2d');
        context.lineWidth = 2;
        context.setLineDash([5]);
        context.strokeStyle = color;
        context.strokeRect(x, y, w, h);
        context.fillStyle = `${color}22`;
        context.fillRect(x, y, w, h);

        context.fillStyle = color;
        context.fillRect(x, y, RESIZE_SIZE, RESIZE_SIZE);
        context.fillRect(x + w - RESIZE_SIZE, y, RESIZE_SIZE, RESIZE_SIZE);
        context.fillRect(x, y + h - RESIZE_SIZE, RESIZE_SIZE, RESIZE_SIZE);
        context.fillRect(x + w - RESIZE_SIZE, y + h - RESIZE_SIZE, RESIZE_SIZE, RESIZE_SIZE);
    }
};

const renderCursor = (canvas: HTMLCanvasElement, point: Point, labels: Label[], callback: (direction: Direction) => void) => {
    if (!labels || !point)
        return;

    for (const label of labels) {
        const {x, y, w, h} = convertLabel(canvas, label);

        if (point[0] > x && point[0] < x + RESIZE_SIZE) {
            if (point[1] > y && point[1] < y + RESIZE_SIZE) {
                callback('top-left');
                return;
            }
            if (point[1] > y + h - RESIZE_SIZE && point[1] < y + h) {
                callback('bottom-left');
                return;
            }
        } else if (point[0] > x + w - RESIZE_SIZE && point[0] < x + w) {
            if (point[1] > y && point[1] < y + RESIZE_SIZE) {
                callback('top-right');
                return;
            }
            if (point[1] > y + h - RESIZE_SIZE && point[1] < y + h) {
                callback('bottom-right');
                return;
            }
        }
    }

    callback(null)
};

const currentLabelsHoverIds = (canvas: HTMLCanvasElement, point: Point, labels: Label[]) => {
    let labelsHoverIds = [];
    for (const label of labels) {
        const {x, y, w, h} = convertLabel(canvas, label);

        if (x < point[0]) {
            if (y < point[1]) {
                if ((x + w) > point[0]) {
                    if ((y + h) > point[1]) {
                        labelsHoverIds.push(label.id);
                    }
                }
            }

        }
    }
    return labelsHoverIds;
};

const currentLabelsTranslated = (canvas: HTMLCanvasElement, labels: Label[], pointA: Point, pointB: Point) => {
    return labels.map(label => {
        let delta = currentDelta(canvas, pointA, pointB);
        return ({
            ...label,
            x: Math.min(Math.max(label.x + delta[0], 0), 1 - label.w),
            y: Math.min(Math.max(label.y + delta[1], 0), 1 - label.h)
        });
    });
};

const currentLabelsResized = (canvas: HTMLCanvasElement, labels: Label[], pointA: Point, pointB: Point, direction: Direction, exclude: Boolean = false) => {
    return labels.map(label => {
        let delta = currentDelta(canvas, pointA, pointB);

        let x, y, w, h;

        if (direction === 'top-left') {
            x = label.x + delta[0];
            y = label.y + delta[1];
            w = label.w - delta[0];
            h = label.h - delta[1];
        } else if (direction === 'top-right') {
            x = label.x;
            y = label.y + delta[1];
            w = label.w + delta[0];
            h = label.h - delta[1];
        } else if (direction === 'bottom-left') {
            x = label.x + delta[0];
            y = label.y;
            w = label.w - delta[0];
            h = label.h + delta[1];
        } else if (direction === 'bottom-right') {
            x = label.x;
            y = label.y;
            w = label.w + delta[0];
            h = label.h + delta[1];
        }

        // Reversed corrections
        if (w < 0) {
            w = Math.abs(w);
            x -= w;
        }
        if (h < 0) {
            h = Math.abs(h);
            y -= h;
        }

        // Offset corrections
        if (x < 0)
            x = 0;
        if (y < 0)
            y = 0;
        if (x + w > 1)
            w = 1 - x;
        if (y + h > 1)
            h = 1 - y;

        // Small labels corrections
        if (exclude) {
            if (w * (canvas.width - 2 * CANVAS_OFFSET) < LABEL_MIN_WIDTH)
                w = (3 + LABEL_MIN_WIDTH) / (canvas.width - 2 * CANVAS_OFFSET);
            if (h * (canvas.height - 2 * CANVAS_OFFSET) < LABEL_MIN_HEIGHT)
                h = (3 + LABEL_MIN_HEIGHT) / (canvas.height - 2 * CANVAS_OFFSET);
        }

        return ({
            ...label,
            x, y, w, h
        });
    });
};


const checkLabelsEquality = (labels: Label[], newLabels: Label[]) => _.isEqual(labels, newLabels);

const formatRatio = ratio => Math.abs(Math.round(ratio * 1e6) / 1e6);


const ContextMenu: FC<ContextMenuProps> = ({point, handleClose}) => {

    return (
        <Menu
            keepMounted
            open={point[0] !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                point[0] !== null
                    ? {top: point[1], left: point[0]}
                    : undefined
            }
        >
            <MenuItem onClick={handleClose}>
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                Delete
            </MenuItem>
        </Menu>
    )
};

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


const ToolMove: FC<ToolMoveProps> = ({labels, setLabels, setTool, autoSwitch}) => {

    const classes = useStyles();

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
            drawLabels(canvas, labels.filter(label => labelsHoverIds.includes(label.id)));
            renderCursor(canvas, point, labels, direction => setDirection(direction));
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
                drawLabels(canvas, labelsTranslated);
            } else {
                let labelsResized = currentLabelsResized(canvas, storedLabels, point, storedPoint, direction);
                drawLabels(canvas, labelsResized);
            }
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 1) {
            let labelsHoverIds = currentLabelsHoverIds(canvasRef.current, point, labels);
            if (labelsHoverIds.length > 0) {
                setStoredPoint(point);
                setLabels(labels.filter(label => !labelsHoverIds.includes(label.id)));
                setStoredLabels(labels.filter(label => labelsHoverIds.includes(label.id)));
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
                setLabels([...labels, ...labelsTranslated]);
            } else {
                let labelsResized = currentLabelsResized(canvas, storedLabels, point, storedPoint, direction, true);
                setLabels([...labels, ...labelsResized]);
            }

            setStoredPoint(null);
            setStoredLabels([]);
        }
    };

    const [contextMenuPoint, setContextMenuPoint] = useState<Point>([null, null]);
    const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setContextMenuPoint([event.clientX - 2, event.clientY - 4]);
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
                point={contextMenuPoint}
                handleClose={handleClose}
            />
        </>
    )
};


const DTLabelisator: FC<DTLabelisatorProps> = ({
                                                   className,
                                                   ...rest
                                               }) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {images, saveImages} = useImages();
    const [selected, setSelected] = useState(0);

    const [labels, setLabels] = useState<Label[]>(images[selected].labels || []);

    const labelsChanged: boolean = !checkLabelsEquality(labels, images[selected].labels);

    const saveLabels = async (labels: Label[]) => {
        if (labelsChanged) {
            const response = await api.post<Image>(`/v1/images/labeling/${images[selected].id}`, {labels});
            enqueueSnackbar('Labels updated', {variant: 'success'});
            saveImages(
                images.map(image => image.id === response.data.id
                    ? {
                        ...image,
                        labels: response.data.labels
                    }
                    : image
                )
            );
        }
    };

    useEffect(() => {
        setLabels(images[selected].labels);
    }, [images, selected]);

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'a') {
            setTool('label')
        } else if (event.key === 'z') {
            if (labels.length === 0) return;
            setTool('move')
        } else if (event.key === 'ArrowLeft') {
            if (selected === 0) return;
            setSelected(selected - 1);
        } else if (event.key === 'ArrowRight') {
            if (selected === images.length - 1) return;
            setSelected(selected + 1);
        } else if (event.key === ' ') {
            await saveLabels(labels);
            if (selected === images.length - 1) return;
            setSelected(selected + 1);
        } else if (event.key === 'Escape') {
            setLabels(images[selected].labels)
        }
    };

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelected(value - 1);
    };


    const [tool, setTool] = useState<string>('label');
    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
        if (newTool !== null)
            setTool(newTool);
    };

    const [autoSwitch, setAutoSwitch] = useState<boolean>(true);

    useEventListener(window, 'keydown', handleKeyDown);

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <div className={classes.actions}>
                <ToggleButtonGroup
                    value={tool}
                    exclusive
                    onChange={handleToolChange}
                    size="small"
                >
                    <ToggleButton
                        value="label"
                        disabled={autoSwitch}
                    >
                        <Tooltip
                            title={<Typography variant='overline'>
                                Draw tool (a)
                            </Typography>}
                        >
                            <LabelIcon/>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton
                        value="move"
                        disabled={autoSwitch || labels.length === 0}
                    >
                        <Tooltip
                            title={<Typography variant='overline'>
                                Move tool (z)
                            </Typography>}
                        >
                            <MoveIcon/>
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>

                <Box ml={2}>
                    <FormControlLabel
                        control={(
                            <Switch
                                color="secondary"
                                size='small'
                                checked={autoSwitch}
                                onChange={() => setAutoSwitch(!autoSwitch)}
                            />
                        )}
                        label={(
                            <Typography
                                color='textSecondary'
                            >
                                Auto switch
                            </Typography>
                        )}
                    />
                </Box>

                <div className='flexGrow'/>

                <Tooltip
                    title={<Typography variant='overline'>
                        Reset (ESCAPE)
                    </Typography>}
                >
                    <span>
                        <Button
                            onClick={() => setLabels(images[selected].labels)}
                            disabled={!labelsChanged}
                            size='small'
                        >
                            Reset
                        </Button>
                    </span>
                </Tooltip>
                <Tooltip
                    title={<Typography variant='overline'>
                        Save (SPACE)
                    </Typography>}
                >
                    <span>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => saveLabels(labels)}
                            disabled={!labelsChanged}
                            size='small'
                        >
                            Save
                        </Button>
                    </span>
                </Tooltip>
            </div>

            <div
                className={classes.container}
                style={{maxWidth: 700 * images[selected].width / images[selected].height}}
            >
                {tool === 'label' && (
                    <ToolLabel
                        labels={labels}
                        setLabels={setLabels}
                        setTool={setTool}
                        autoSwitch={autoSwitch}
                    />
                )}
                {tool === 'move' && (
                    <ToolMove
                        labels={labels}
                        setLabels={setLabels}
                        setTool={setTool}
                        autoSwitch={autoSwitch}
                    />
                )}
                <DTImage
                    image={images[selected]}
                    labels={labels}
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
