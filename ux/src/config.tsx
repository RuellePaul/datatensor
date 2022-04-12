import React from 'react';
import * as Yup from 'yup';
import {
    AutoAwesome as MiscelleanousIcon,
    BeachAccess as AccessoryIcon,
    BlurCircularOutlined as GaussianDistortionIcon,
    BlurOn as DistortionIcon,
    Brightness7 as BrightnessIcon,
    CommuteOutlined as VehicleIcon,
    CompareArrowsOutlined as ShearIcon,
    ContrastOutlined as ContrastIcon,
    CropRotate as RotateIcon,
    Deck as FurnitureIcon,
    Devices as ApplianceIcon,
    EmojiNature as OutdoorIcon,
    EmojiPeopleOutlined as PersonIcon,
    Equalizer as HistogramIcon,
    Fastfood as FoodIcon,
    FiberManualRecord as GreyScaleIcon,
    Flip as FlipIcon,
    FilterTiltShiftTwoTone as SkewIcon,
    HomeOutlined as IndoorIcon,
    InvertColors as InvertIcon,
    Kitchen as KitchenIcon,
    MemoryOutlined as ElectronicIcon,
    PaletteOutlined as ColorIcon,
    PetsOutlined as AnimalIcon,
    PhotoSizeSelectLarge as CropIcon,
    SportsFootball as SportsIcon
} from '@mui/icons-material';
import {OperationType, Pipeline} from './types/pipeline';
import {SuperCategory} from 'src/types/category';


export const MAX_DATASETS_DISPLAYED = 3;
export const MAX_CATEGORIES_DISPLAYED = 16;
export const MIN_LABELS_WARNING_EXPORT = 500;
export const MAX_OPERATIONS_PER_PIPELINE = 5;

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

export const SUPERCATEGORIES_ICONS = {
    person: <PersonIcon color="inherit" fontSize="small" />,
    vehicle: <VehicleIcon color="inherit" fontSize="small" />,
    electronic: <ElectronicIcon color="inherit" fontSize="small" />,
    indoor: <IndoorIcon color="inherit" fontSize="small" />,
    outdoor: <OutdoorIcon color="inherit" fontSize="small" />,
    sports: <SportsIcon color="inherit" fontSize="small" />,
    furniture: <FurnitureIcon color="inherit" fontSize="small" />,
    accessory: <AccessoryIcon color="inherit" fontSize="small" />,
    kitchen: <KitchenIcon color="inherit" fontSize="small" />,
    animal: <AnimalIcon color="inherit" fontSize="small" />,
    appliance: <ApplianceIcon color="inherit" fontSize="small" />,
    food: <FoodIcon color="inherit" fontSize="small" />,
    miscellaneous: <MiscelleanousIcon color="inherit" fontSize="small" />,
}

export const OPERATIONS_ICONS = {
    rotate: <RotateIcon />,
    flip_random: <FlipIcon />,
    skew: <SkewIcon />,
    crop_random: <CropIcon />,
    shear: <ShearIcon />,
    random_distortion: <DistortionIcon />,
    gaussian_distortion: <GaussianDistortionIcon />,
    random_brightness: <BrightnessIcon />,
    random_color: <ColorIcon />,
    random_contrast: <ContrastIcon />,
    histogram_equalisation: <HistogramIcon />,
    invert: <InvertIcon />,
    greyscale: <GreyScaleIcon />
};

export const OPERATIONS_DESCRIPTION = {
    rotate: `Rotate an image by an random amount, within a range specified.
             The parameters max_left_rotation and max_right_rotation allow you to control this range.`,
    flip_random: `Flip (mirror) the image along either its horizontal or vertical axis.`,
    skew: `Skew an image in a random direction, either left to right, top to bottom, or one of 8 corner directions.`,
    crop_random: `Crop a random area of an image, based on the percentage area to be returned.`,
    shear: `Shear the image by a specified number of degrees.`,
    random_distortion: `Performs a randomised, elastic distortion controlled by the parameters specified. 
                        The grid width and height controls how fine the distortions are. Smaller sizes will result in 
                        larger, more pronounced, and less granular distortions. Larger numbers will result in finer, 
                        more granular distortions. The magnitude of the distortions can be controlled using magnitude.`,
    gaussian_distortion: `Performs a randomised, elastic gaussian distortion controlled by the parameters specified. 
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
};

export const OPERATIONS_SHAPES = {
    rotate: {
        max_left_rotation: Yup.number()
            .min(0)
            .max(25)
            .required('Field required'),
        max_right_rotation: Yup.number()
            .min(0)
            .max(25)
            .required('Field required')
    },
    skew: {
        magnitude: Yup.number()
            .min(0)
            .max(1)
            .required('Field required')
    },
    crop_random: {
        percentage_area: Yup.number()
            .min(0)
            .max(1)
            .required('Field required'),
        randomise_percentage_area: Yup.boolean()
    },
    shear: {
        max_shear_left: Yup.number()
            .min(1)
            .max(25)
            .required('Field required'),
        max_shear_right: Yup.number()
            .min(1)
            .max(25)
            .required('Field required')
    },
    random_distortion: {
        grid_width: Yup.number()
            .min(1)
            .max(20)
            .required('Field required'),
        grid_height: Yup.number()
            .min(1)
            .max(20)
            .required('Field required'),
        magnitude: Yup.number()
            .min(1)
            .max(20)
            .required('Field required')
    },
    gaussian_distortion: {
        grid_width: Yup.number()
            .min(1)
            .max(20)
            .required('Field required'),
        grid_height: Yup.number()
            .min(1)
            .max(20)
            .required('Field required'),
        magnitude: Yup.number()
            .min(1)
            .max(20)
            .required('Field required')
    },
    random_brightness: {
        min_factor: Yup.number()
            .min(1)
            .max(4)
            .required('Field required'),
        max_factor: Yup.number()
            .min(1)
            .max(4)
            .required('Field required')
            .moreThan(Yup.ref('min_factor'))
    },
    random_contrast: {
        min_factor: Yup.number()
            .min(1)
            .max(4)
            .required('Field required'),
        max_factor: Yup.number()
            .min(1)
            .max(4)
            .required('Field required')
            .moreThan(Yup.ref('min_factor'))
    },
    random_color: {
        min_factor: Yup.number()
            .min(1)
            .max(4)
            .required('Field required'),
        max_factor: Yup.number()
            .min(1)
            .max(4)
            .required('Field required')
            .moreThan(Yup.ref('min_factor'))
    }
};

export const DEFAULT_PIPELINE: Pipeline = {
    operations: [
        {
            type: 'rotate',
            probability: 0.8,
            properties: OPERATIONS_INITIAL_PROPERTIES.rotate
        },
        {
            type: 'random_distortion',
            probability: 0.35,
            properties: OPERATIONS_INITIAL_PROPERTIES.random_distortion
        },
    ]
};
