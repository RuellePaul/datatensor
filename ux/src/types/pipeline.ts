export type OperationType =
    'rotate'
    | 'flip_random'
    | 'skew'
    | 'crop_random'
    | 'shear'
    | 'random_distortion'
    | 'gaussian_distortion'
    | 'random_brightness'
    | 'random_color'
    | 'random_contrast'
    | 'histogram_equalisation'
    | 'invert'
    | 'greyscale';

export interface RotateProperties {
    max_left_rotation: number;
    max_right_rotation: number;
}

export interface SkewProperties {
    magnitude: number;
}

export interface CropRandomProperties {
    percentage_area: number;
    randomise_percentage_area?: boolean;
}

export interface ShearProperties {
    max_shear_left: number;
    max_shear_right?: boolean;
}

export interface RandomDistortionProperties {
    grid_width: number;
    grid_height: number;
    magnitude: number;
}

type Corner = 'bell' | 'ul' | 'ur' | 'dl' | 'dr';
type Method = 'in' | 'out';
export interface GaussianDistortionProperties {
    grid_width: number;
    grid_height: number;
    magnitude: number;
    corner: Corner;
    method: Method;
}

export interface RandomBrightnessProperties {
    min_factor: number;
    max_factor: number;
}

export interface RandomColorProperties {
    min_factor: number;
    max_factor: number;
}

export interface RandomContrastProperties {
    min_factor: number;
    max_factor: number;
}

export type OperationProperties =
    RotateProperties
    | SkewProperties
    | CropRandomProperties
    | ShearProperties
    | RandomDistortionProperties
    | GaussianDistortionProperties
    | RandomBrightnessProperties
    | RandomColorProperties
    | RandomContrastProperties


export interface Operation {
    id: string;
    type: OperationType;
    probability: number;
    properties: OperationProperties;
}

export interface Pipeline {
    id?: string;
    operations: Operation[];
    image_count?: number;
}
