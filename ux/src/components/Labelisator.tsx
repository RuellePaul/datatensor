import React, {FC, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import useEventListener from 'use-typed-event-listener';
import {useSnackbar} from 'notistack';
import {v4 as uuid} from 'uuid';
import {Button, makeStyles, Tooltip, Typography} from '@material-ui/core';
import {Pagination, ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import {Theme} from 'src/theme';
import DTImage from 'src/components/Image';
import useImages from 'src/hooks/useImages';
import {Label} from 'src/types/label';
import {Image} from 'src/types/image';
import api from 'src/utils/api';

interface DTLabelisatorProps {
    className?: string;
}

interface ToolLabelProps {
    labels: Label[];
    setLabels: (labels: Label[]) => void;
}

interface ToolMoveProps {
    labels: Label[];
    setLabels: (labels: Label[]) => void;
}

type Direction = 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right' | null;
type Point = number[];

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    container: {
        position: 'relative',
        margin: 'auto'
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
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

const LABEL_MIN_WIDTH = 20;
const LABEL_MIN_HEIGHT = 20;

const currentPoint = (nativeEvent) => ([nativeEvent.offsetX, nativeEvent.offsetY]);

const reset = (canvas: HTMLCanvasElement) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};

const drawCursorLines = (canvas: HTMLCanvasElement, point: Point) => {
    let context = canvas.getContext('2d');
    context.beginPath();
    context.setLineDash([5]);
    context.moveTo(point[0], 0);
    context.lineTo(point[0], canvas.height);
    context.moveTo(0, point[1]);
    context.lineTo(canvas.width, point[1]);
    context.stroke();
};

const drawRect = (canvas: HTMLCanvasElement, pointA: Point, pointB: Point) => {
    if (!pointA || !pointB)
        return;
    let x = pointA[0];
    let y = pointA[1];
    let w = pointB[0] - pointA[0];
    let h = pointB[1] - pointA[1];
    let color = (Math.abs(w) < LABEL_MIN_WIDTH || Math.abs(h) < LABEL_MIN_HEIGHT) ? '#FF0000' : '#000000';
    let context = canvas.getContext('2d');
    context.lineWidth = 2;
    context.setLineDash([5]);
    context.strokeStyle = color;
    context.strokeRect(x, y, w, h);
    context.fillStyle = `${color}11`;
    context.fillRect(x, y, w, h);
};

const RESIZE_SIZE = 8;

const drawLabelsHovered = (canvas: HTMLCanvasElement, labels: Label[]) => {
    if (!labels)
        return;
    for (const label of labels) {
        let x = label.x * canvas.width;
        let y = label.y * canvas.height;
        let w = label.w * canvas.width;
        let h = label.h * canvas.height;
        let color = '#000000';
        let context = canvas.getContext('2d');
        context.lineWidth = 2;
        context.setLineDash([5]);
        context.strokeStyle = color;
        context.strokeRect(x, y, w, h);
        context.fillStyle = `${color}33`;
        context.fillRect(x, y, w, h);

        context.fillStyle = '#FFFFFF';
        context.fillRect(x, y, RESIZE_SIZE, RESIZE_SIZE);
        context.fillRect(x + w - RESIZE_SIZE, y, RESIZE_SIZE, RESIZE_SIZE);
        context.fillRect(x, y + h - RESIZE_SIZE, RESIZE_SIZE, RESIZE_SIZE);
        context.fillRect(x + w - RESIZE_SIZE, y + h - RESIZE_SIZE, RESIZE_SIZE, RESIZE_SIZE);
    }
};

let direction: Direction = null;
const renderCursor = (canvas: HTMLCanvasElement, point: Point, labels: Label[]) => {
    if (!labels || !point)
        return;

    direction = null;

    for (const label of labels) {
        let x = label.x * canvas.width;
        let y = label.y * canvas.height;
        let w = label.w * canvas.width;
        let h = label.h * canvas.height;

        if (point[0] > x && point[0] < x + RESIZE_SIZE) {
            if (point[1] > y && point[1] < y + RESIZE_SIZE * 2) {
                direction = 'top-left';
            }
            if (point[1] > y + h - RESIZE_SIZE && point[1] < y + h) {
                direction = 'bottom-left'
            }
        }

        if (point[0] > x + w - RESIZE_SIZE && point[0] < x + w) {
            if (point[1] > y && point[1] < y + RESIZE_SIZE * 2) {
                direction = 'top-right'
            }
            if (point[1] > y + h - RESIZE_SIZE && point[1] < y + h) {
                direction = 'bottom-right';
            }
        }

    }
};

const currentLabelsHoverIds = (canvas: HTMLCanvasElement, point: Point, labels: Label[]) => {
    let labelsHoverIds = [];
    for (const label of labels) {
        if (label.x * canvas.width < point[0]) {
            if (label.y * canvas.height < point[1]) {
                if ((label.x + label.w) * canvas.width > point[0]) {
                    if ((label.y + label.h) * canvas.height > point[1]) {
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
        let delta: Point = [(pointA[0] - pointB[0]) / canvas.width, (pointA[1] - pointB[1]) / canvas.height];
        return ({
            ...label,
            x: Math.min(Math.max(label.x + delta[0], 0), 1 - label.x),
            y: Math.min(Math.max(label.y + delta[1], 0), 1 - label.y)
        });
    });
};

const currentLabelsResized = (canvas: HTMLCanvasElement, labels: Label[], pointA: Point, pointB: Point, direction: Direction) => {
    return labels.map(label => {
        let delta: Point = [(pointA[0] - pointB[0]) / canvas.width, (pointA[1] - pointB[1]) / canvas.height];

        let x, y, w, h;

        if (direction === 'top-left')
            return ({
                ...label,
                x: label.x + delta[0],
                y: label.y + delta[1],
                w: label.w - delta[0],
                h: label.h - delta[1]
            });
        else if (direction === 'top-right')
            return ({
                ...label,
                y: label.y + delta[1],
                w: label.w + delta[0],
                h: label.h - delta[1]
            });
        else if (direction === 'bottom-left')
            return ({
                ...label,
                x: label.x + delta[0],
                w: label.w - delta[0],
                h: label.h + delta[1]
            });
        else if (direction === 'bottom-right')
            return ({
                ...label,
                w: label.w + delta[0],
                h: label.h + delta[1]
            });
        return ({
            ...label,
            x, y, w, h
        })
    });
};


const checkLabelsEquality = (labels: Label[], newLabels: Label[]) => _.isEqual(labels, newLabels);

const formatRatio = ratio => Math.abs(Math.round(ratio * 1e6) / 1e6);


const ToolLabel: FC<ToolLabelProps> = ({labels, setLabels}) => {

    const classes = useStyles();
    const canvasRef = useRef(null);

    const [storedPoint, setStoredPoint] = useState<Point>(null);

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        let canvas = canvasRef.current;
        reset(canvas);

        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 0) // IDLE
            drawCursorLines(canvas, point);

        if (event.nativeEvent.which === 1)  // START DRAW LABEL
            drawRect(canvas, point, storedPoint)
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        reset(canvasRef.current);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        if (event.nativeEvent.which === 1)
            setStoredPoint(currentPoint(event.nativeEvent));
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
        if (event.nativeEvent.which === 1) {
            if (!storedPoint) return;

            let point = currentPoint(event.nativeEvent);
            let canvas = canvasRef.current;
            if (canvas === null) return;
            if (Math.abs(storedPoint[0] - point[0]) < LABEL_MIN_WIDTH) return;
            if (Math.abs(storedPoint[1] - point[1]) < LABEL_MIN_HEIGHT) return;
            let newLabel = {
                id: uuid(),
                x: formatRatio(Math.min(point[0], storedPoint[0]) / canvas.width),
                y: formatRatio(Math.min(point[1], storedPoint[1]) / canvas.height),
                w: formatRatio((point[0] - storedPoint[0]) / canvas.width),
                h: formatRatio((point[1] - storedPoint[1]) / canvas.height)
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
            style={{cursor: 'crosshair'}}
        />
    )
};


const ToolMove: FC<ToolMoveProps> = ({labels, setLabels}) => {

    const classes = useStyles();

    const canvasRef = useRef<HTMLCanvasElement>();

    const [storedPoint, setStoredPoint] = useState<Point>(null);
    const [storedLabels, setStoredLabels] = useState<Label[]>([]);

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        let canvas = canvasRef.current;
        reset(canvas);
        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 0) { // IDLE
            let labelsHoverIds = currentLabelsHoverIds(canvas, point, labels);
            canvas.style.cursor = labelsHoverIds.length > 0 ? 'grab' : 'not-allowed';
            drawLabelsHovered(canvas, labels.filter(label => labelsHoverIds.includes(label.id)));
            renderCursor(canvas, point, labels);
        }

        if (event.nativeEvent.which === 1) { // START MOVE
            if (storedLabels.length === 0) return;
            if (direction === null) {
                let labelsTranslated = currentLabelsTranslated(canvas, storedLabels, point, storedPoint);
                drawLabelsHovered(canvas, labelsTranslated);
                canvas.style.cursor = 'grabbing';
            } else {
                let labelsResized = currentLabelsResized(canvas, storedLabels, point, storedPoint, direction);
                drawLabelsHovered(canvas, labelsResized);
                if (direction === 'top-left' || 'bottom-right') {
                    canvas.style.cursor = 'nwse-resize';
                } else if (direction === 'top-right' || 'bottom-left') {
                    canvas.style.cursor = 'nesw-resize';
                }
            }
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        let canvas = canvasRef.current;
        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 1) {
            let labelsHoverIds = currentLabelsHoverIds(canvasRef.current, point, labels);
            if (labelsHoverIds.length > 0) {
                setStoredPoint(point);
                setLabels(labels.filter(label => !labelsHoverIds.includes(label.id)));
                setStoredLabels(labels.filter(label => labelsHoverIds.includes(label.id)));
                canvas.style.cursor = 'grabbing';
            }
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
        let canvas = canvasRef.current;
        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 1) { // LEFT CLICK
            if (!storedPoint || !storedLabels) return;
            if (storedLabels.length === 0) return;

            if (direction === null) {
                let labelsTranslated = currentLabelsTranslated(canvas, storedLabels, point, storedPoint);
                setLabels([...labels, ...labelsTranslated]);
                canvas.style.cursor = 'grab';
            } else {
                let labelsResized = currentLabelsResized(canvas, storedLabels, point, storedPoint, direction);
                setLabels([...labels, ...labelsResized]);
                renderCursor(canvas, point, labels);
            }

            setStoredPoint(null);
            setStoredLabels([]);

            direction = null;
        }
    };

    return (
        <canvas
            className={classes.canvas}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            ref={canvasRef}
        />
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

    const handlePaginationChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        await saveLabels(labels);
        setSelected(value - 1);
    };


    const [tool, setTool] = useState<string>('label');

    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
        if (newTool !== null)
            setTool(newTool);
    };

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
                        disabled={labels.length === 0}
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

                <div className='flexGrow'/>

                <Tooltip
                    title={<Typography variant='overline'>
                        Reset (ESCAPE)
                    </Typography>}
                >
                    <Button
                        onClick={() => setLabels(images[selected].labels)}
                        disabled={!labelsChanged}
                        size='small'
                    >
                        Reset
                    </Button>
                </Tooltip>
                <Tooltip
                    title={<Typography variant='overline'>
                        Save (SPACE)
                    </Typography>}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => saveLabels(labels)}
                        disabled={!labelsChanged}
                        size='small'
                    >
                        Save
                    </Button>
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
                    />
                )}
                {tool === 'move' && (
                    <ToolMove
                        labels={labels}
                        setLabels={setLabels}
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
