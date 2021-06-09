import React from 'react';
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
import {OperationType} from './types/pipeline';
import {SuperCategory} from 'src/types/category';

export const SUPERCATEGORIES: SuperCategory[] = ['person', 'vehicle', 'electronic', 'indoor', 'outdoor', 'sports', 'furniture', 'accessory', 'kitchen', 'animal', 'appliance', 'food'];

export const OPERATIONS_TYPES: OperationType[] = [
    'rotate',
    'flip',
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
]

export const OPERATIONS_ICONS = {
    rotate: <RotateIcon/>,
    flip: <FlipIcon/>,
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
}
