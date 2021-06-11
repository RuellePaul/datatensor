import React, {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';
import type {Theme} from 'src/theme';
import {useSelector} from 'src/store';
import {Operation} from 'src/types/pipeline';
import {Image} from 'src/types/image';
import useImage from 'src/hooks/useImage';
import api from 'src/utils/api';

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

    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const doSample = useCallback(async () => {
        if (pipeline.isLoaded) {
            const operations: Operation[] = pipeline.operations.allIds.map(id => pipeline.operations.byId[id])

            const response = await api.post<string>('/augmentor/sample', {
                dataset_id,
                image_id,
                operations,
            })

            setImageBase64(response.data);
        }
    }, [pipeline, dataset_id, image_id])

    useEffect(() => {
        doSample()
    }, [doSample]);

    if (imageBase64 === null)
        return null;

    return (
        <div className={clsx(classes.root, className)}>
            <img
                src={`data:image/png;base64, ${imageBase64}`}
                alt='Augmented sample'
                width="100%"
                draggable={false}
            />
        </div>
    );
};

export default PipelineSample;
