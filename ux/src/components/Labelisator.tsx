import React, {FC, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {v4 as uuid} from 'uuid';
import {Button, makeStyles} from '@material-ui/core';
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

type Point = number[];

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        outline: 'none'
    },
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
        zIndex: 1000,
        cursor: 'crosshair'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(1, 2)
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
    context.fillStyle = `${color}33`;
    context.fillRect(x, y, w, h);
};


const arrayOfLabelsEquals = (labels, newLabels) => (
    labels.map(label => label.id).sort().join('') === newLabels.map(label => label.id).sort().join('')
);


const formatRatio = ratio => Math.abs(Math.round(ratio * 1e6) / 1e6);

let storedPoint;

const DTLabelisator: FC<DTLabelisatorProps> = ({
                                                   className,
                                                   ...rest
                                               }) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const canvasRef = useRef();

    const {images, saveImages} = useImages();
    const [selected, setSelected] = useState(0);

    // Labels
    const [labels, setLabels] = useState<Label[]>(images[selected].labels || []);

    const labelsChanged: boolean = !arrayOfLabelsEquals(labels, images[selected].labels);

    const saveLabels = async (labels: Label[]) => {
        if (labelsChanged) {
            const response = await api.post<Image>(`/v1/images/labeling/${images[selected].id}`, {labels});
            enqueueSnackbar('Labels saved');
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

    // Pagination
    const handlePaginationChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        await saveLabels(labels);
        setSelected(value - 1);
    };

    const handleKeyDown = async (event: React.KeyboardEvent<unknown>) => {
        if (event.key === 'ArrowLeft') {
            if (selected === 0) return;
            await saveLabels(labels);
            setSelected(selected - 1);
        } else if (event.key === 'ArrowRight') {
            if (selected === images.length - 1) return;
            await saveLabels(labels);
            setSelected(selected + 1);
        }
    };

    useEffect(() => {
        setLabels(images[selected].labels);
    }, [images, selected]);


    // Tools
    const [tool, setTool] = useState<string>('label');

    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
        if (newTool !== null)
            setTool(newTool);
    };

    // Mouse events
    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        reset(canvasRef.current);
        let point = currentPoint(event.nativeEvent);

        if (event.nativeEvent.which === 0) // IDLE
            drawCursorLines(canvasRef.current, point);

        if (event.nativeEvent.which === 1)  // LEFT CLICK
            drawRect(canvasRef.current, point, storedPoint)
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        reset(canvasRef.current);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        if (event.nativeEvent.which === 1)
            storedPoint = currentPoint(event.nativeEvent);
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
        if (event.nativeEvent.which === 1) {
            let point = currentPoint(event.nativeEvent);
            let canvas = canvasRef.current || null;
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
        <div
            className={clsx(classes.root, className)}
            onKeyDown={handleKeyDown}
            tabIndex={1000}
            {...rest}
        >
            <div className={classes.actions}>
                <ToggleButtonGroup
                    value={tool}
                    exclusive
                    onChange={handleToolChange}
                    size="small"
                >
                    <ToggleButton value="label">
                        <LabelIcon/>
                    </ToggleButton>
                    <ToggleButton value="move">
                        <MoveIcon/>
                    </ToggleButton>
                </ToggleButtonGroup>

                <div className='flexGrow'/>

                <Button
                    onClick={() => setLabels(images[selected].labels)}
                    disabled={!labelsChanged}
                    size='small'
                >
                    Clear
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveLabels(labels)}
                    disabled={!labelsChanged}
                    size='small'
                >
                    Save
                </Button>
            </div>

            <div
                className={classes.container}
                style={{maxWidth: 700 * images[selected].width / images[selected].height}}
            >
                <canvas
                    className={classes.canvas}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={canvasRef}
                />
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
