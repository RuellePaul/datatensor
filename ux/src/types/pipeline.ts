export type OperationType =
    'rotate'
    | 'flip_random'
    | 'skew'
    | 'scale'
    | 'crop'
    | 'shear'
    | 'elastic_distortion'
    | 'gaussian_distortion'
    | 'random_brightness'
    | 'random_color'
    | 'random_contrast'
    | 'histogram_equalisation'
    | 'invert'
    | 'grey_scale'
    | 'black_and_white';

export interface RotateProperties {
    max_left_rotation: number;
    max_right_rotation: number;
}

export interface FlipRandomProperties {
}

export interface SkewProperties {
    magnitude: number;
}

export type OperationProperties =
    RotateProperties
    | FlipRandomProperties
    | SkewProperties


export interface Operation {
    id: string;
    type: OperationType;
    probability: number;
    properties: OperationProperties;
}

export interface Pipeline {
    operations: Operation[];
}
