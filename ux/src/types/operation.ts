export interface Operation {
    _id: string;
    type: 'rotate' | 'shear' | 'skew' | 'random_distortion' | 'gaussian_distortion' | 'flip_random'
    probability: number;
    params: object;
}
