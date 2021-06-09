import type {ChangeEvent, FC} from 'react';
import React, {useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {Box, Button, capitalize, FormControl, InputLabel, makeStyles, MenuItem, Select} from '@material-ui/core';
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
    PhotoSizeSelectLarge as CropIcon,
} from '@material-ui/icons';
import {Theme} from 'src/theme';
import {useDispatch} from 'src/store';
import {createOperation} from 'src/slices/pipeline';
import {OperationType} from 'src/types/pipeline';

interface OperationAddProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    select: {
        paddingLeft: theme.spacing(1)
    },
    adornment: {
        marginLeft: theme.spacing(4)
    }
}));

const OPERATIONS_TYPES: OperationType[] = [
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

const OPERATIONS_ICONS = {
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

const OperationAdd: FC<OperationAddProps> = ({
                                                 className,
                                                 ...rest
                                             }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const [operationType, setOperationType] = useState<OperationType>(OPERATIONS_TYPES[0]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();
        setOperationType(event.target.value as OperationType);
    };

    const handleAddInit = (): void => {
        setExpanded(true);
    };

    const handleAddCancel = (): void => {
        setExpanded(false);
        setOperationType(OPERATIONS_TYPES[0]);
    };

    const handleAddConfirm = async (): Promise<void> => {
        try {
            await dispatch(createOperation(operationType));
            setExpanded(false);
            setOperationType(OPERATIONS_TYPES[0]);
            enqueueSnackbar('Operation created', {
                variant: 'success'
            });
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Something went wrong', {
                variant: 'error'
            });
        }
    };

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            {isExpanded ? (
                <>
                    <FormControl
                        fullWidth
                        variant='filled'
                    >
                        <InputLabel className={classes.adornment}>
                            Operation type
                        </InputLabel>
                        <Select
                            classes={{select: classes.select}}
                            fullWidth
                            name='type'
                            onChange={handleChange}
                            value={operationType || OPERATIONS_TYPES[0]}
                            variant='filled'
                            startAdornment={OPERATIONS_ICONS[operationType]}
                            renderValue={() => capitalize(operationType).replaceAll('_', ' ')}
                        >
                            {OPERATIONS_TYPES.map(type => (
                                <MenuItem
                                    key={type}
                                    value={type}
                                >
                                    <Box mr={1}>
                                        {OPERATIONS_ICONS[type]}
                                    </Box>

                                    {capitalize(type).replaceAll('_', ' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box
                        mt={2}
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Button
                            onClick={handleAddCancel}
                            variant='text'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddConfirm}
                            variant='contained'
                            color='secondary'
                        >
                            Add
                        </Button>
                    </Box>
                </>
            ) : (
                <Box
                    display='flex'
                    justifyContent='center'
                >
                    <Button onClick={handleAddInit}>
                        Add another operation
                    </Button>
                </Box>
            )}
        </div>
    );
};

export default OperationAdd;
