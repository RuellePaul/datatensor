import _ from 'lodash';
import {Direction} from 'src/types/direction';
import {Label} from 'src/types/label';
import {Point} from 'src/types/point';
import {Category} from 'src/types/category';
import {COLORS} from 'src/utils/colors';
import {capitalize} from '@material-ui/core';

export const RESIZE_SIZE = 8;
export const LABEL_MIN_WIDTH = 25;
export const LABEL_MIN_HEIGHT = 25;
export const CANVAS_OFFSET = 40;
export const MIN_FONT_SIZE = 16;
export const MAX_FONT_SIZE = 24;

export const currentPoint = (nativeEvent) => ([nativeEvent.offsetX, nativeEvent.offsetY]);

export const reset = (canvas: HTMLCanvasElement) => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};

export const pointIsOutside = (canvas: HTMLCanvasElement, point: Point) => {
    if (point[0] < CANVAS_OFFSET || point[0] > canvas.width - CANVAS_OFFSET)
        return true;
    else if (point[1] < CANVAS_OFFSET || point[1] > canvas.height - CANVAS_OFFSET)
        return true;
    return false
};

export const currentDelta = (canvas: HTMLCanvasElement, pointA: Point, pointB: Point) => {
    if (!pointA || !pointB)
        return [0, 0];
    let delta: Point = [
        (pointA[0] - pointB[0]) / (canvas.width - 2 * CANVAS_OFFSET),
        (pointA[1] - pointB[1]) / (canvas.height - 2 * CANVAS_OFFSET)
    ];
    return delta
};

export const convertLabel = (canvas: HTMLCanvasElement, label: Label, offset = CANVAS_OFFSET) => {
    let x = offset + label.x * (canvas.width - 2 * offset);
    let y = offset + label.y * (canvas.height - 2 * offset);
    let w = label.w * (canvas.width - 2 * offset);
    let h = label.h * (canvas.height - 2 * offset);
    return {x, y, w, h}
};

export const drawCursorLines = (canvas: HTMLCanvasElement, point: Point) => {
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

export const drawRect = (canvas: HTMLCanvasElement, pointA: Point, pointB: Point) => {
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

export const drawLabels = (canvas: HTMLCanvasElement, labels: Label[], categories: Category[], offset = CANVAS_OFFSET, dash = 0, filled = false, resize = false) => {
    if (!labels)
        return;

    let context = canvas.getContext('2d');
    context.lineWidth = 2;
    context.setLineDash([dash]);

    for (const label of labels) {
        const category = categories.find(category => label.category_id === category.id);

        const {x, y, w, h} = convertLabel(canvas, label, offset);

        let color = COLORS[categories.indexOf(category)] || '#000000';

        context.strokeStyle = color;
        context.strokeRect(x, y, w, h);

        context.fillStyle = `${color}05`;
        context.fillRect(x, y, w, h);
        if (filled) {
            context.fillStyle = `${color}25`;
            context.fillRect(x, y, w, h);
        }

        if (resize) {
            context.fillStyle = color;
            context.fillRect(x, y, RESIZE_SIZE, RESIZE_SIZE);
            context.fillRect(x + w - RESIZE_SIZE, y, RESIZE_SIZE, RESIZE_SIZE);
            context.fillRect(x, y + h - RESIZE_SIZE, RESIZE_SIZE, RESIZE_SIZE);
            context.fillRect(x + w - RESIZE_SIZE, y + h - RESIZE_SIZE, RESIZE_SIZE, RESIZE_SIZE);
        }

        if (category && w > category.name.length * 5 && h > LABEL_MIN_HEIGHT * 2) {
            let fontSize = Math.max(Math.min(w / 10, MAX_FONT_SIZE), MIN_FONT_SIZE);
            context.font = `${fontSize}px Roboto, Helvetica, Arial, sans-serif`;
            context.fillStyle = color;
            context.fillText(capitalize(category.name), x + 5, y + fontSize);
        }
    }
};

export const renderCursor = (canvas: HTMLCanvasElement, point: Point, labels: Label[], callback: (direction: Direction) => void) => {
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

export const currentLabelsHoverIds = (canvas: HTMLCanvasElement, point: Point, labels: Label[]) => {
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

export const currentLabelsTranslated = (canvas: HTMLCanvasElement, labels: Label[], pointA: Point, pointB: Point) => {
    return labels.map(label => {
        let delta = currentDelta(canvas, pointA, pointB);
        return ({
            ...label,
            x: Math.min(Math.max(label.x + delta[0], 0), 1 - label.w),
            y: Math.min(Math.max(label.y + delta[1], 0), 1 - label.h)
        });
    });
};

export const currentLabelsResized = (canvas: HTMLCanvasElement, labels: Label[], pointA: Point, pointB: Point, direction: Direction, exclude: Boolean = false) => {
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

export const checkLabelsEquality = (labels: Label[], newLabels: Label[]) => _.isEqual(labels, newLabels);

export const formatRatio = ratio => Math.abs(Math.round(ratio * 1e6) / 1e6);