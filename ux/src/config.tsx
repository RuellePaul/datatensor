import React from 'react';
import * as Yup from 'yup';
import {
    AspectRatio as ScaleIcon,
    BlurOn as DistortionIcon,
    Brightness7 as BrightnessIcon,
    CropRotate as RotateIcon,
    Equalizer as HistogramIcon,
    Flip as FlipIcon,
    FormatItalic as SkewIcon,
    InvertColors as InvertIcon,
    Iso as BlackAndWhiteIcon,
    PaletteOutlined as ColorIcon,
    PhotoSizeSelectLarge as CropIcon
} from '@material-ui/icons';
import {OperationType, Pipeline} from './types/pipeline';
import {SuperCategory} from 'src/types/category';

export const SUPERCATEGORIES: SuperCategory[] = ['person', 'vehicle', 'electronic', 'indoor', 'outdoor', 'sports', 'furniture', 'accessory', 'kitchen', 'animal', 'appliance', 'food'];

export const OPERATIONS_TYPES: OperationType[] = [
    'rotate',
    'flip_random',
    'skew',
    'scale',
    'crop',
    'shear',
    'elastic_distortion',
    'gaussian_distortion',
    'random_brightness',
    'random_color',
    'random_contrast',
    'histogram_equalisation',
    'invert',
    'grey_scale',
    'black_and_white'
];

export const OPERATIONS_ICONS = {
    rotate: <RotateIcon/>,
    flip_random: <FlipIcon/>,
    skew: <SkewIcon/>,
    scale: <ScaleIcon/>,
    crop: <CropIcon/>,
    shear: <RotateIcon/>,
    elastic_distortion: <DistortionIcon/>,
    gaussian_distortion: <DistortionIcon/>,
    random_brightness: <BrightnessIcon/>,
    random_color: <ColorIcon/>,
    random_contrast: <RotateIcon/>,
    histogram_equalisation: <HistogramIcon/>,
    invert: <InvertIcon/>,
    grey_scale: <RotateIcon/>,
    black_and_white: <BlackAndWhiteIcon/>
};

export const OPERATIONS_INITIAL_PROPERTIES = {
    rotate: {
        max_left_rotation: 25,
        max_right_rotation: 25
    },
    flip_random: {},
    skew: {
        magnitude: 1
    }
}

export const OPERATIONS_SHAPES = {
    rotate: {
        max_left_rotation: Yup.number().min(0).max(25).required('Field required'),
        max_right_rotation: Yup.number().min(0).max(25).required('Field required')
    },
    skew: {
        magnitude: Yup.number().min(0).max(1).required('Field required')
    }
};

export const DEFAULT_PIPELINE: Pipeline = {
    operations: [
        {
            id: '6e72802f-e64e-4ad9-8dc6-ede3fa2f498b',
            type: 'rotate',
            probability: 0.8,
            properties: OPERATIONS_INITIAL_PROPERTIES.rotate
        }

    ]
};