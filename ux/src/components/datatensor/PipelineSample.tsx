import React, {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import clsx from 'clsx';
import {Grid, LinearProgress, makeStyles, Typography} from '@material-ui/core';
import type {Theme} from 'src/theme';
import {useSelector} from 'src/store';
import {Operation} from 'src/types/pipeline';
import useImage from 'src/hooks/useImage';
import api from 'src/utils/api';
import ImageBase64 from 'src/components/utils/ImageBase64';

interface PipelineSampleProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const PipelineSample: FC<PipelineSampleProps> = ({className}) => {
    const classes = useStyles();

    const {dataset_id} = useParams();
    const {image} = useImage();

    const pipeline = useSelector<any>((state) => state.pipeline);
    const image_id = image._id;

    const [imagesBase64, setImagesBase64] = useState<string[] | null>(null);

    const doSample = useCallback(async () => {
        setImagesBase64(null);

        if (pipeline.isLoaded) {
            const operations: Operation[] = pipeline.operations.allIds.map(id => pipeline.operations.byId[id])

            const response = await api.post<string[]>('/augmentor/sample', {
                dataset_id,
                image_id,
                operations,
            })

            setImagesBase64(response.data);
        }
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
                {imagesBase64 === null
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
                            <LinearProgress variant='query'/>
                        </Grid>
                    ) : (
                        imagesBase64.map((imageBase64, index) => (
                            <Grid
                                key={index}
                                item
                                xs={4}
                            >
                                <ImageBase64 base64string={imageBase64}/>
                            </Grid>
                        ))
                    )
                }
            </Grid>
        </div>
    );
};

export default PipelineSample;
