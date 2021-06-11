export type OperationType =
    'rotate'
    | 'flip'
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

export interface Operation {
    id: string;
    type: OperationType;
    probability: number;
    properties: object;
}

export interface Pipeline {
    operations: Operation[];
}
