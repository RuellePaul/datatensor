import React, {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import clsx from 'clsx';
import {CircularProgress, Grid, makeStyles, Typography} from '@material-ui/core';
import type {Theme} from 'src/theme';
import {useSelector} from 'src/store';
import {Operation} from 'src/types/pipeline';
import useImage from 'src/hooks/useImage';
import api from 'src/utils/api';
import ImageBase64 from 'src/components/utils/ImageBase64';
import {Label} from 'src/types/label';
import {useSnackbar} from 'notistack';
import wait from 'src/utils/wait';

interface PipelineSampleProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const PipelineSample: FC<PipelineSampleProps> = ({className}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset_id} = useParams();
    const {image} = useImage();

    const pipeline = useSelector<any>((state) => state.pipeline);
    const image_id = image.id;

    const [imagesBase64, setImagesBase64] = useState<string[] | null>(null);
    const [imagesLabels, setImagesLabels] = useState<Label[][] | null>(null);

    const doSample = useCallback(async () => {
        setImagesBase64(null);

        if (dataset_id && image_id && pipeline.isLoaded) {
            const operations: Operation[] = pipeline.operations.allIds.map(id => pipeline.operations.byId[id])

            try {
                await wait(10);

                const response = await api.post<{ images: string[], images_labels: Label[][] }>(`/datasets/${dataset_id}/pipelines/sample`, {
                    image_id,
                    operations
                })

                setImagesBase64(response.data.images);
                setImagesLabels(response.data.images_labels)

            } catch (error) {
                console.error(error);
                enqueueSnackbar((error.message) || 'Something went wrong', {variant: 'error'});
            }
        }

        // eslint-disable-next-line
    }, [pipeline, dataset_id, image_id])

    useEffect(() => {
        doSample()
    }, [doSample]);

    return (
        <div className={clsx(classes.root, className)}>
            <Grid
                container
                spacing={1}
            >
                {imagesBase64 === null || imagesLabels === null
                    ? (
                        <Grid
                            item
                            xs={12}
                        >
                            <Typography
                                color='textSecondary'
                                variant='subtitle2'
                                gutterBottom
                            >
                                Computing....
                            </Typography>
                            <CircularProgress/>
                        </Grid>
                    ) : (
                        imagesBase64.map((imageBase64, index) => (
                            <Grid
                                key={index}
                                item
                                xs={image.width > image.height ? 6 : 4}
                            >
                                <ImageBase64
                                    imageBase64={imageBase64}
                                    labels={imagesLabels[index]}
                                />
                            </Grid>
                        ))
                    )
                }
            </Grid>
        </div>
    );
};

export default PipelineSample;
