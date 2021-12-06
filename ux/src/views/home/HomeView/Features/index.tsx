import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, ButtonBase, Container, Grid, Link, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {blueDark, Theme} from 'src/theme';
import FeatureLabeling from './FeatureLabeling';
import {BrandingWatermarkOutlined as LabelingIcon, DynamicFeedOutlined as AugmentationIcon} from '@mui/icons-material';
import api from 'src/utils/api';
import {Label} from 'src/types/label';
import {Image} from 'src/types/image';
import {Dataset} from 'src/types/dataset';
import {Category} from 'src/types/category';
import {DatasetProvider} from 'src/store/DatasetContext';
import {ImagesProvider} from 'src/store/ImagesContext';
import {ImageProvider} from 'src/store/ImageContext';

interface FeaturesProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(10, 0),
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
            }
        }
    },
    container: {
        [theme.breakpoints.down('lg')]: {
            flexDirection: 'column-reverse'
        }
    },
    button: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        borderRadius: 10,
        padding: 20,
        marginTop: 10,
        border: `solid 1px transparent`,
        '&:hover, &:focus': {
            background: theme.palette.background.paper
        },
        '&.selected': {
            background: blueDark[700],
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

const FEATURES = [
    {
        title: 'Image labeling',
        subtitle: 'Ergonomic and intuitive tools for labeling your datasets.',
        docPath: '/docs/datasets/labeling',
        component: <FeatureLabeling />,
        icon: <LabelingIcon />
    },
    {
        title: 'Image augmentation',
        subtitle:
            'Image augmentation on your labeled datasets, by computing the positions of objects on the new images.',
        docPath: '/docs/datasets/labeling',
        component: <div />,
        icon: <AugmentationIcon />
    }
];

const Features: FC<FeaturesProps> = ({className, ...rest}) => {
    const classes = useStyles();

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

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Container component="section" maxWidth="lg">
                <Grid className={classes.container} container spacing={4}>
                    <Grid item lg={7} xs={12}>
                        {dataset !== null && images.length > 0 && (
                            <DatasetProvider dataset={dataset} categories={categories}>
                                <ImagesProvider images={images}>
                                    <ImageProvider
                                        image={image}
                                        labels={labels.filter(label => label.image_id === image.id)}
                                    >
                                        {React.cloneElement(FEATURES[selected].component, {className: 'visible'})}
                                    </ImageProvider>
                                </ImagesProvider>
                            </DatasetProvider>
                        )}
                    </Grid>

                    <Grid item lg={5} xs={12}>
                        <Typography variant="overline" color="primary" fontSize={16}>
                            Features
                        </Typography>
                        <Typography variant="h1" color="textPrimary">
                            Lorem ipsum{' '}
                            <Typography component="span" color="primary">
                                dolor
                            </Typography>{' '}
                            est
                        </Typography>
                        <Box mb={4}>
                            <Typography color="textSecondary">Lorem ipsum dolor est...</Typography>
                        </Box>

                        {FEATURES.map((feature, index) => (
                            <ButtonBase
                                className={clsx(classes.button, selected === index && 'selected')}
                                disableRipple
                                key={`feature-${index}`}
                                onClick={() => setSelected(index)}
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
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Features;
