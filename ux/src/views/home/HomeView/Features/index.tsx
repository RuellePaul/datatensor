import React, {cloneElement, FC, useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import {Package as DatasetIcon} from 'react-feather';
import {Box, ButtonBase, Container, Grid, Link, Typography, useMediaQuery} from '@mui/material';
import {BrandingWatermarkOutlined as LabelingIcon, DynamicFeedOutlined as AugmentationIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {blueDark, Theme} from 'src/theme';
import FeatureDatasets from './FeatureDatasets';
import FeatureLabeling from './FeatureLabeling';
import FeatureAugmentation from './FeatureAugmentation';
import api from 'src/utils/api';
import {Image} from 'src/types/image';
import {Dataset} from 'src/types/dataset';
import {DatasetProvider} from 'src/store/DatasetContext';
import {ImagesProvider} from 'src/store/ImagesContext';
import {ImageProvider} from 'src/store/ImageContext';
import randomIndexes from 'src/utils/randomIndexes';

interface FeatureProps {
    className?: string;
}

interface FeatureButtonProps {
    feature: any; // TODO
    index: number;
    selected: number;
    setSelected: React.Dispatch<React.SetStateAction<number>>;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(10, 0),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(8, 0),
            '& > *': {
                textAlign: 'center'
            }
        },
        '& h1': {
            marginBottom: theme.spacing(1),
            fontFamily:
                'PlusJakartaSans-ExtraBold, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            fontSize: 36,
            fontWeight: 'bold',
            lineHeight: '1.11429',
            '& span': {
                fontSize: 'inherit',
                fontWeight: 'inherit',
                whiteSpace: 'nowrap'
            },
            [theme.breakpoints.down('sm')]: {
                fontSize: 32
            }
        }
    },
    feature: {
        padding: theme.spacing(2, 2, 0.5),
        background: theme.palette.background.paper,
        border: `solid 1px ${theme.palette.divider}`,
        borderRadius: 8,
        transition: 'all 0.15s ease-out',
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1.5),
            background: 'none !important'
        }
    },
    button: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 10,
        padding: 20,
        marginBottom: theme.spacing(3),
        border: `solid 1px transparent`,
        '&:hover': {
            background: theme.palette.background.paper
        },
        '&.selected': {
            background: theme.palette.mode === 'dark' ? blueDark[700] : 'none',
            border: `solid 1px ${theme.palette.primary.main}`
        },
        '& > div': {
            textAlign: 'left'
        },
        '& svg': {
            margin: theme.spacing(1),
            marginRight: theme.spacing(3),
            fontSize: 28,
            color: theme.palette.primary.main,
            minWidth: 25
        }
    }
}));

const FEATURES = [
    {
        title: 'Datasets',
        subtitle: 'Create, organize and share your labeled image datasets with the world',
        docPath: '/docs/create-a-dataset',
        icon: <DatasetIcon />,
        component: <FeatureDatasets datasets={[]} />
    },
    {
        title: 'Image labeling',
        subtitle: 'Ergonomic and intuitive tools for labeling your datasets.',
        docPath: '/docs/datasets/labeling',
        icon: <LabelingIcon />,
        component: <FeatureLabeling />
    },
    {
        title: 'Image augmentation',
        subtitle: 'Get more labeled images, without the tears.',
        docPath: '/docs/datasets/augmentation',
        icon: <AugmentationIcon />,
        component: <FeatureAugmentation />
    }
];

const FeatureButton: FC<FeatureButtonProps> = ({feature, index, selected, setSelected}) => {
    const classes = useStyles();

    const handleChangeIndex = index => {
        if (index === selected) return;

        setSelected(index);
    };

    return (
        <ButtonBase
            className={clsx(classes.button, selected === index && 'selected')}
            disableRipple
            key={`feature-${index}`}
            onClick={() => handleChangeIndex(index)}
        >
            {feature.icon}

            <Box>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                    {feature.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    {feature.subtitle}
                </Typography>
                <Link onClick={() => window.open(feature.docPath, '_blank')}>Learn more</Link>
            </Box>
        </ButtonBase>
    );
};

const Features: FC<FeatureProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const [selected, setSelected] = useState(0);

    const [datasets, setDatasets] = useState<Dataset[]>(null);
    const [images, setImages] = useState<Image[]>([]);

    const handleFetchPublic = useCallback(async () => {
        try {
            const response = await api.get<{
                datasets: Dataset[];
                images: Image[];
            }>(`/public/`);

            setDatasets(response.data.datasets);
            setImages(response.data.images);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        handleFetchPublic();
    }, [handleFetchPublic]);

    const indexes = useMemo(
        () => randomIndexes(FEATURES.length, 1, images.filter(image => image.dataset_id === datasets[0].id).length),
        [datasets, images]
    );

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Container component="section" maxWidth="lg">
                <Grid container spacing={isMobile ? 0 : 6}>
                    <Grid item md={5} xs={12}>
                        <Typography variant="overline" color="primary" fontSize={16}>
                            Features
                        </Typography>
                        <Typography variant="h1" color="textPrimary">
                            A wide range of tools{' '}
                            <Typography component="span" color="primary">
                                to build faster
                            </Typography>
                        </Typography>

                        <Box height={24} />

                        {FEATURES.map((feature, index) => (
                            <FeatureButton
                                key={`feature-button-${index}`}
                                feature={feature}
                                index={index}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        ))}
                    </Grid>

                    <Grid
                        item
                        md={7}
                        xs={12}
                        id="features"
                        sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                        {datasets !== null && images.length > 0 && (
                            <DatasetProvider dataset={datasets[0]} categories={datasets[0].categories}>
                                <ImagesProvider images={images}>
                                    {FEATURES.map((feature, index) => (
                                        <ImageProvider
                                            key={feature.docPath}
                                            image={images[indexes[index]]}
                                            labels={images[indexes[index]].labels}
                                        >
                                            {selected === index &&
                                                cloneElement(feature.component, {
                                                    className: clsx(classes.feature, selected === index && 'selected'),
                                                    key: feature.title,
                                                    datasets
                                                })}
                                        </ImageProvider>
                                    ))}
                                </ImagesProvider>
                            </DatasetProvider>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Features;
