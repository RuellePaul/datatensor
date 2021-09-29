import React from 'react';
import * as Yup from 'yup';
import {
    BlurOn as DistortionIcon,
    Brightness7 as BrightnessIcon,
    CropRotate as RotateIcon,
    Equalizer as HistogramIcon,
    FiberManualRecord as GreyScaleIcon,
    Flip as FlipIcon,
    FormatItalic as SkewIcon,
    InvertColors as InvertIcon,
    PaletteOutlined as ColorIcon,
    PhotoSizeSelectLarge as CropIcon
} from '@material-ui/icons';
import {OperationType, Pipeline} from './types/pipeline';
import {SuperCategory} from 'src/types/category';

export const MAX_CATEGORIES_DISPLAYED = 24;

export const SUPERCATEGORIES: SuperCategory[] = [
    'person',
    'vehicle',
    'electronic',
    'indoor',
    'outdoor',
    'sports',
    'furniture',
    'accessory',
    'kitchen',
    'animal',
    'appliance',
    'food',
    'miscellaneous'
];

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

export const OPERATIONS_DESCRIPTION = {
    rotate: `The operation will rotate an image by an random amount, within a range specified.
             The parameters max_left_rotation and max_right_rotation allow you to control this range.`,
    flip_random: `Flip (mirror) the image along either its horizontal or vertical axis.`,
    skew: `Skew an image in a random direction, either left to right, top to bottom, or one of 8 corner directions.`,
    crop_random: `Crop a random area of an image, based on the percentage area to be returned.`,
    shear: `Shear the image by a specified number of degrees.`,
    random_distortion: `This function performs a randomised, elastic distortion controlled by the parameters specified. 
                        The grid width and height controls how fine the distortions are. Smaller sizes will result in 
                        larger, more pronounced, and less granular distortions. Larger numbers will result in finer, 
                        more granular distortions. The magnitude of the distortions can be controlled using magnitude.`,
    gaussian_distortion: `This function performs a randomised, elastic distortion controlled by the parameters specified. 
                          The grid width and height controls how fine the distortions are. Smaller sizes will result in 
                          larger, more pronounced, and less granular distortions. Larger numbers will result in finer, 
                          more granular distortions. The magnitude of the distortions can be controlled using magnitude.`,
    random_brightness: `Random change brightness of an image.`,
    random_color: `Random change saturation of an image.`,
    random_contrast: `Random change contrast of an image.`,
    histogram_equalisation: `Apply histogram equalisation to the image.`,
    invert: `Invert an image.`,
    greyscale: `Convert image to greyscale.`
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
        max_factor: Yup.number().min(1).max(4).required('Field required').moreThan(Yup.ref('min_factor'))
    },
    random_contrast: {
        min_factor: Yup.number().min(1).max(4).required('Field required'),
        max_factor: Yup.number().min(1).max(4).required('Field required').moreThan(Yup.ref('min_factor'))
    },
    random_color: {
        min_factor: Yup.number().min(1).max(4).required('Field required'),
        max_factor: Yup.number().min(1).max(4).required('Field required').moreThan(Yup.ref('min_factor'))
    }
};

export const DEFAULT_PIPELINE: Pipeline = {
    operations: [
        {
            id: '6e72802f-e64e-4ad9-8dc6-ede3fa2f498b',
            type: 'rotate',
            probability: 0.8,
            properties: OPERATIONS_INITIAL_PROPERTIES.rotate
        },
        {
            id: '100af1ba-9cd7-44c5-9f31-223996f916f7',
            type: 'random_distortion',
            probability: 0.65,
            properties: OPERATIONS_INITIAL_PROPERTIES.random_distortion
        },
    ]
};