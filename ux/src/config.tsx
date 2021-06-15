import React from 'react';
import * as Yup from 'yup';
import {
    BlurOn as DistortionIcon,
    Brightness7 as BrightnessIcon,
    CropRotate as RotateIcon,
    Equalizer as HistogramIcon,
    Flip as FlipIcon,
    FormatItalic as SkewIcon,
    InvertColors as InvertIcon,
    PaletteOutlined as ColorIcon,
    PhotoSizeSelectLarge as CropIcon,
    FiberManualRecord as GreyScaleIcon
} from '@material-ui/icons';
import {OperationType, Pipeline} from './types/pipeline';
import {SuperCategory} from 'src/types/category';

export const SUPERCATEGORIES: SuperCategory[] = ['person', 'vehicle', 'electronic', 'indoor', 'outdoor', 'sports', 'furniture', 'accessory', 'kitchen', 'animal', 'appliance', 'food'];

export const OPERATIONS_TYPES: OperationType[] = [
    'rotate',
    'flip_random',
    'skew',
    'crop_random',
    'shear',
    'random_distortion',
    'gaussian_distortion',
    'random_brightness',
    'random_color',
    'random_contrast',
    'histogram_equalisation',
    'invert',
    'greyscale'
];

export const OPERATIONS_ICONS = {
    rotate: <RotateIcon/>,
    flip_random: <FlipIcon/>,
    skew: <SkewIcon/>,
    crop_random: <CropIcon/>,
    shear: <RotateIcon/>,
    random_distortion: <DistortionIcon/>,
    gaussian_distortion: <DistortionIcon/>,
    random_brightness: <BrightnessIcon/>,
    random_color: <ColorIcon/>,
    random_contrast: <RotateIcon/>,
    histogram_equalisation: <HistogramIcon/>,
    invert: <InvertIcon/>,
    greyscale: <GreyScaleIcon/>
};

export const OPERATIONS_INITIAL_PROPERTIES = {
    rotate: {
        max_left_rotation: 25,
        max_right_rotation: 25
    },
    skew: {
        magnitude: 1
    },
    crop_random: {
        percentage_area: 0.75,
        randomise_percentage_area: false
    },
    shear: {
        max_shear_left: 25,
        max_shear_right: 25
    },
    random_distortion: {
        grid_width: 8,
        grid_height: 8,
        magnitude: 10
    },
    gaussian_distortion: {
        grid_width: 8,
        grid_height: 8,
        magnitude: 10,
        corner: 'bell',
        method: 'in'
    },
    random_brightness: {
        min_factor: 1,
        max_factor: 2
    },
    random_contrast: {
        min_factor: 1,
        max_factor: 2
    },
    random_color: {
        min_factor: 1,
        max_factor: 2
    }
}

export const OPERATIONS_SHAPES = {
    rotate: {
        max_left_rotation: Yup.number().min(0).max(25).required('Field required'),
        max_right_rotation: Yup.number().min(0).max(25).required('Field required')
    },
    skew: {
        magnitude: Yup.number().min(0).max(1).required('Field required')
    },
    crop_random: {
        percentage_area: Yup.number().min(0).max(1).required('Field required'),
        randomise_percentage_area: Yup.boolean()
    },
    shear: {
        max_shear_left: Yup.number().min(1).max(25).required('Field required'),
        max_shear_right: Yup.number().min(1).max(25).required('Field required')
    },
    random_distortion: {
        grid_width: Yup.number().min(1).max(20).required('Field required'),
        grid_height: Yup.number().min(1).max(20).required('Field required'),
        magnitude: Yup.number().min(1).max(20).required('Field required')
    },
    gaussian_distortion: {
        grid_width: Yup.number().min(1).max(20).required('Field required'),
        grid_height: Yup.number().min(1).max(20).required('Field required'),
        magnitude: Yup.number().min(1).max(20).required('Field required')
    },
    random_brightness: {
        min_factor: Yup.number().min(1).max(4).required('Field required'),
        max_factor: Yup.number().min(1).max(4).required('Field required')
    },
    random_contrast: {
        min_factor: Yup.number().min(1).max(4).required('Field required'),
        max_factor: Yup.number().min(1).max(4).required('Field required')
    },
    random_color: {
        min_factor: Yup.number().min(1).max(4).required('Field required'),
        max_factor: Yup.number().min(1).max(4).required('Field required')
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