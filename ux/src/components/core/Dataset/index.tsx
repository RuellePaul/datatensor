import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {
    Box,
    capitalize,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Chip,
    Link,
    Skeleton,
    Stack,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
    LocalOfferOutlined as LabelsIcon,
    Lock as PrivateIcon,
    PhotoLibraryOutlined as ImagesIcon,
    Public as PublicIcon
} from '@mui/icons-material';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import {Image} from 'src/types/image';
import UserAvatar from 'src/components/UserAvatar';
import WorkingAlert from 'src/components/core/WorkingAlert';
import {UserConsumer, UserProvider} from 'src/store/UserContext';
import {EMPTY_DESCRIPTIONS} from 'src/constants';
import DTImage from 'src/components/core/Images/Image';
import {ImageProvider} from 'src/store/ImageContext';
import useDataset from 'src/hooks/useDataset';
import {Category} from 'src/types/category';

interface DatasetProps {
    image?: Image;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        maxWidth: 400,
        width: '100%'
    },
    media: {
        height: 200
    },
    categories: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    category: {
        color: 'white',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(3px)',
        marginBottom: theme.spacing(0.5)
    },
    chip: {
        marginLeft: 6
    },
    link: {
        fontWeight: 400
    },
    noWrap: {
        whiteSpace: 'nowrap'
    },
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        '& > p': {
            whiteSpace: 'nowrap'
        }
    },
    icon: {
        color: theme.palette.text.primary,
        marginRight: 8,
        verticalAlign: 'middle'
    },
    image: {
        zIndex: 0,
        maxHeight: 300,
        minWidth: '100%',
        overflow: 'hidden'
    }
}));

interface CategoryProps {
    category: Category;
    index: number;
}

const DTCategory: FC<CategoryProps> = ({category, index}) => {
    const classes = useStyles();

    return (
        <Chip
            className={classes.category}
            label={
                <Typography variant="body2">
                    <strong>
                        {capitalize(category.name)}
                        {` • ${category.labels_count || 0}`}
                    </strong>
                </Typography>
            }
            title={`${capitalize(category.name)} | ${capitalize(category.supercategory)}`}
            size="small"
            variant="outlined"
            style={{filter: `opacity(${1 - 0.15 * index})`}}
        />
    );
};

const DTDataset: FC<DatasetProps> = ({className, image = null, onClick, disabled = false, ...rest}) => {
    const classes = useStyles();
    const history = useHistory();

    const datasetRef = useRef(null);

    const {dataset, categories} = useDataset();

    const [imagePreview, setImagePreview] = useState<Image>(image);

    const fetchImage = useCallback(async () => {
        try {
            const response = await api.get<{images: Image[]}>(`/datasets/${dataset.id}/images/`, {
                params: {
                    include_labels: true,
                    limit: 1
                }
            });
            setImagePreview(response.data.images[0]);
        } catch (err) {
            console.error(err);
        }
    }, [dataset.id]);

    useEffect(() => {
        if (image === null) fetchImage();
    }, [fetchImage, image]);

    const totalLabelsCount = categories.map(category => category.labels_count || 0).reduce((acc, val) => acc + val, 0);

    return (
        <Card className={clsx(classes.root, className)} ref={datasetRef} variant="outlined" {...rest}>
            <UserProvider user={dataset.user}>
                <UserConsumer>
                    {value => (
                        <CardHeader
                            avatar={<UserAvatar user={value.user} />}
                            title={<Typography variant="h6">{dataset.name && capitalize(dataset.name)}</Typography>}
                            subheader={
                                <Box mt={'2px'}>
                                    <Link
                                        className={classes.link}
                                        color="inherit"
                                        component={RouterLink}
                                        onClick={event => event.stopPropagation()}
                                        to={`/users/${value.user.id}`}
                                        variant="subtitle2"
                                    >
                                        {value.user.name}
                                    </Link>
                                    &nbsp; •
                                    <Chip
                                        className={classes.chip}
                                        label={dataset.is_public ? 'Public' : 'Private'}
                                        icon={dataset.is_public ? <PublicIcon /> : <PrivateIcon />}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            }
                        />
                    )}
                </UserConsumer>
            </UserProvider>

            <CardActionArea
                onClick={onClick instanceof Function ? onClick : () => history.push(`/datasets/${dataset.id}#`)}
                disabled={disabled}
            >
                {imagePreview ? (
                    <Box position="relative">
                        <ImageProvider image={imagePreview} labels={imagePreview.labels}>
                            <DTImage className={classes.image} skeleton />

                            <div className={classes.categories}>
                                {categories
                                    .sort((a, b) => (a.labels_count > b.labels_count ? -1 : 1))
                                    .slice(0, 4)
                                    .map((category, index) => (
                                        <DTCategory category={category} index={index} key={category.id} />
                                    ))}
                            </div>
                        </ImageProvider>
                    </Box>
                ) : (
                    <Skeleton width="100%" height={270} sx={{transform: 'none'}} />
                )}
                <CardContent>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                        <Box pr={1}>
                            <Typography variant="h5" gutterBottom>
                                {dataset.name && capitalize(dataset.name)}
                            </Typography>
                            <Typography
                                color="textSecondary"
                                variant="body2"
                                component="p"
                                dangerouslySetInnerHTML={{
                                    __html: EMPTY_DESCRIPTIONS.includes(dataset.description)
                                        ? '<i>No description provided</i>'
                                        : dataset.description.length > 70
                                        ? `${dataset.description.slice(0, 70)}...`
                                        : dataset.description
                                }}
                            />
                        </Box>
                        <Box>
                            <Stack spacing={1}>
                                <Box className={classes.wrapper}>
                                    <ImagesIcon className={classes.icon} />

                                    <Typography fontWeight={600} color="textPrimary">
                                        {dataset.image_count}{' '}
                                        <Typography
                                            variant="h5"
                                            component="span"
                                            color="textSecondary"
                                            fontWeight={400}
                                        >
                                            {dataset.image_count > 1 ? 'images' : 'image'}
                                        </Typography>
                                        {dataset.augmented_count > 0 && (
                                            <Typography
                                                variant="caption"
                                                component="p"
                                                color="textSecondary"
                                                fontWeight={400}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    component="span"
                                                    color="textPrimary"
                                                    fontWeight={600}
                                                >
                                                    +{dataset.augmented_count}
                                                </Typography>{' '}
                                                augmented
                                            </Typography>
                                        )}
                                    </Typography>
                                </Box>
                                <Box className={classes.wrapper}>
                                    <LabelsIcon className={classes.icon} />

                                    <Typography fontWeight={600} color="textPrimary">
                                        {totalLabelsCount}{' '}
                                        <Typography
                                            variant="subtitle1"
                                            component="span"
                                            color="textSecondary"
                                            fontWeight={400}
                                        >
                                            labels
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>

                    <WorkingAlert dataset_id={dataset.id} />
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default DTDataset;
