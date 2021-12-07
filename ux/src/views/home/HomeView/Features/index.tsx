import React, {cloneElement, FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, ButtonBase, Container, Grid, Hidden, Link, Typography, useMediaQuery} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {blueDark, Theme} from 'src/theme';
import FeatureLabeling from './FeatureLabeling';
import FeatureAugmentation from './FeatureAugmentation';
import {BrandingWatermarkOutlined as LabelingIcon, DynamicFeedOutlined as AugmentationIcon} from '@mui/icons-material';
import api from 'src/utils/api';
import {Label} from 'src/types/label';
import {Image} from 'src/types/image';
import {Dataset} from 'src/types/dataset';
import {Category} from 'src/types/category';
import {DatasetProvider} from 'src/store/DatasetContext';
import {ImagesProvider} from 'src/store/ImagesContext';
import {ImageProvider} from 'src/store/ImageContext';
import useScroll from 'src/hooks/useScroll';

interface FeaturesProps {
    className?: string;
}

interface FeatureButtonProps {
    feature: any; // TODO
    index: number;
    selected: number;
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
    container: {
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse'
        }
    },
    sticky: {
        zIndex: 1050,
        position: 'sticky',
        top: 100,
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content',
        paddingBottom: 60,
        background: theme.palette.background.default,
        [theme.breakpoints.down('md')]: {
            paddingBottom: 0,
            top: -86
        }
    },
    feature: {
        padding: theme.spacing(2, 2, 0.5),
        marginBottom: theme.spacing(8),
        background: theme.palette.background.paper,
        border: `solid 1px ${theme.palette.background.paper}`,
        borderRadius: 8,
        opacity: 0.5,
        transition: 'all 0.15s ease-out',
        transform: 'scale(0.95)',
        pointerEvents: 'none',
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1.5),
            marginBottom: theme.spacing(6),
            background: 'none !important'
        },
        '&.selected': {
            opacity: 1,
            border: `solid 1px ${theme.palette.divider}`,
            transform: 'scale(1)',
            pointerEvents: 'initial'
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
            color: theme.palette.primary.main
        }
    }
}));

const OFFSET = 900 - 64;

const FEATURES = [
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

const FeatureButton: FC<FeatureButtonProps> = ({feature, index, selected}) => {
    const classes = useStyles();

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const handleChangeIndex = index => {
        if (index === selected) return;

        // @ts-ignore
        const heights = [...document.querySelectorAll('#features > div')].map(x => x.clientHeight);
        if (heights.length === 0) return;

        if (index > 0)
            document.querySelector('.scroller').scrollTo({top: OFFSET + heights[index - 1], behavior: 'smooth'});
        else document.querySelector('.scroller').scrollTo({top: OFFSET, behavior: 'smooth'});
    };

    return (
        <ButtonBase
            className={clsx(classes.button, isMobile ? 'selected' : selected === index && 'selected')}
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
                <Link component={RouterLink} to={feature.docPath}>
                    Learn more
                </Link>
            </Box>
        </ButtonBase>
    );
};

const Features: FC<FeaturesProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const [selected, setSelected] = useState(0);

    const [dataset, setDataset] = useState<Dataset>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [labels, setLabels] = useState<Label[]>([]);

    const handleFetchPublic = useCallback(async () => {
        try {
            const response = await api.get<{
                datasets: Dataset[];
                categories: Category[];
                images: Image[];
                labels: Label[];
            }>(`/public/`);

            setDataset(response.data.datasets[0]);
            setCategories(response.data.categories);
            setImages(response.data.images);
            setLabels(response.data.labels);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        handleFetchPublic();
    }, [handleFetchPublic]);

    const image = useMemo(() => images[Math.floor(Math.random() * images.length)], [images]);

    const {scrollTop} = useScroll(document.querySelector('.scroller'));

    useEffect(() => {
        if (isMobile) return;

        // @ts-ignore
        const heights = [...document.querySelectorAll('#features > div')].map(x => x.clientHeight);
        if (heights.length === 0) return;

        if (scrollTop < OFFSET + heights[0] / 2) setSelected(0);
        else if (scrollTop < OFFSET + heights[0] + heights[1] / 2) setSelected(1);
        else if (scrollTop < OFFSET + heights[0] + heights[1] + heights[2] / 2) setSelected(2);
        else if (scrollTop < OFFSET + heights[0] + heights[1] + heights[2] + heights[3] / 2) setSelected(3);
        else setSelected(null);
    }, [scrollTop, isMobile]);

    const providerLabels = useMemo(() => labels.filter(label => label.image_id === image.id), [labels, image]);

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Container component="section" maxWidth="lg">
                <Grid className={classes.container} container spacing={isMobile ? 0 : 6}>
                    <Grid item md={7} xs={12} id="features">
                        {dataset !== null && images.length > 0 && (
                            <DatasetProvider dataset={dataset} categories={categories}>
                                <ImagesProvider images={images}>
                                    <ImageProvider image={image} labels={providerLabels}>
                                        {FEATURES.map((feature, index) => (
                                            <>
                                                <Hidden mdUp>
                                                    <FeatureButton
                                                        feature={feature}
                                                        index={index}
                                                        selected={selected}
                                                    />
                                                </Hidden>
                                                {cloneElement(feature.component, {
                                                    className: clsx(
                                                        classes.feature,
                                                        isMobile ? 'selected' : selected === index && 'selected'
                                                    ),
                                                    key: feature.title
                                                })}
                                            </>
                                        ))}
                                    </ImageProvider>
                                </ImagesProvider>
                            </DatasetProvider>
                        )}
                    </Grid>

                    <Grid className={clsx(!isMobile && classes.sticky)} item md={5} xs={12}>
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

                        <Hidden mdDown>
                            {FEATURES.map((feature, index) => (
                                <FeatureButton feature={feature} index={index} selected={selected} />
                            ))}
                        </Hidden>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Features;