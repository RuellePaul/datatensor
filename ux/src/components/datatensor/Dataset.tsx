import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router';
import clsx from 'clsx';
import moment from 'moment';
import {
    Box,
    capitalize,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    CardMedia,
    CircularProgress,
    makeStyles,
    Typography
} from '@material-ui/core';
import {Lock, PhotoLibrary, Public} from '@material-ui/icons';
import {Theme} from 'src/theme';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';
import {Image} from 'src/types/image';
import UserAvatar from 'src/components/UserAvatar';
import {UserConsumer, UserProvider} from 'src/store/UserContext';
import {Alert} from '@material-ui/lab';

interface DatasetProps {
    dataset: Dataset;
    isWorking?: boolean;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        maxWidth: 400
    },
    media: {
        height: 200
    }
}));

const DTDataset: FC<DatasetProps> = ({
                                         className,
                                         dataset,
                                         isWorking = false,
                                         ...rest
                                     }) => {
    const classes = useStyles();
    const history = useHistory();

    const datasetRef = useRef(null);

    const [imagePreview, setImagePreview] = useState<Image>(null);

    const fetchImage = useCallback(async () => {
        try {
            const response = await api.get<{ images: Image[] }>(`/datasets/${dataset._id}/images/`, {
                params: {
                    limit: 1
                }
            });
            setImagePreview(response.data.images[0]);
        } catch (err) {
            console.error(err);
        }

    }, [dataset._id]);

    useEffect(() => {
        fetchImage();
    }, [fetchImage]);

    return (
        <Card
            className={clsx(classes.root, className)}
            ref={datasetRef}
            {...rest}
        >
            <UserProvider user_id={dataset.user_id}>
                <UserConsumer>
                    {value =>
                        <CardHeader
                            avatar={
                                <UserAvatar
                                    user={value.user}
                                />
                            }
                            title={dataset.name}
                            subheader={`${value.user.name} | ${moment(dataset.created_at).format('DD MMMM, YYYY')}`}
                        />
                    }
                </UserConsumer>
            </UserProvider>


            <CardActionArea
                onClick={() => history.push(`/app/manage/datasets/${dataset._id}`)}
            >
                <CardMedia
                    className={classes.media}
                    component='span'
                    image={imagePreview?.path}
                />
                <CardContent>
                    <Box display='flex' alignItems='center' mb={1}>
                        <Typography variant='h5'>
                            {dataset.name && capitalize(dataset.name)}
                        </Typography>

                        <div className='flexGrow'/>

                        <PhotoLibrary/>
                        <Box width={2}/>
                        <Typography variant='overline'>
                            {dataset.image_count} (+0)
                        </Typography>
                        <Box width={12}/>
                        {dataset.is_public
                            ? <Public fontSize='small'/>
                            : <Lock fontSize='small'/>
                        }
                    </Box>
                    <Typography
                        color='textSecondary'
                        variant="body2"
                        component="p"
                        dangerouslySetInnerHTML={{__html: dataset.description || '<i>No description provided</i>'}}
                    />


                    {isWorking && (
                        <Box mt={2}>
                            <Alert severity="warning">
                                A task is running {' '}
                                <CircularProgress color="inherit" size={14}/>
                            </Alert>
                        </Box>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default DTDataset;
