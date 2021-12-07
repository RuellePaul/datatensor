import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, capitalize, Card, CardActionArea, CardContent, CardHeader, Chip, Link, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Lock as PrivateIcon, PhotoLibraryOutlined as ImagesIcon, Public as PublicIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';
import {Image} from 'src/types/image';
import UserAvatar from 'src/components/UserAvatar';
import WorkingAlert from 'src/components/core/WorkingAlert';
import {UserConsumer, UserProvider} from 'src/store/UserContext';
import {EMPTY_DESCRIPTIONS} from 'src/constants';
import DTImage from 'src/components/core/Images/Image';
import {ImageProvider} from 'src/store/ImageContext';

interface DatasetProps {
    dataset: Dataset;
    image?: Image;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        maxWidth: 400
    },
    media: {
        height: 200
    },
    chip: {
        marginLeft: 6
    },
    link: {
        fontWeight: 400
    },
    noWrap: {
        whiteSpace: 'nowrap'
    }
}));

const DTDataset: FC<DatasetProps> = ({className, dataset, image = null, ...rest}) => {
    const classes = useStyles();
    const history = useHistory();

    const datasetRef = useRef(null);

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
        if (image === null)
            fetchImage();
    }, [fetchImage, image]);

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
                                        to={`/app/users/${value.user.id}/details`}
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

            <CardActionArea onClick={() => history.push(`/app/datasets/${dataset.id}#`)}>
                {imagePreview !== null && (
                    <ImageProvider image={imagePreview} labels={imagePreview.labels}>
                        <DTImage skeleton />
                    </ImageProvider>
                )}
                <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="h5">{dataset.name && capitalize(dataset.name)}</Typography>

                        <div className="flexGrow" />

                        <Box mr={0.5}>
                            <ImagesIcon />
                        </Box>
                        <Typography variant="overline" className={classes.noWrap}>
                            {dataset.image_count + dataset.augmented_count}
                        </Typography>
                    </Box>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                        component="p"
                        dangerouslySetInnerHTML={{
                            __html: EMPTY_DESCRIPTIONS.includes(dataset.description)
                                ? '<i>No description provided</i>'
                                : dataset.description
                        }}
                    />

                    <WorkingAlert dataset_id={dataset.id} />
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default DTDataset;
