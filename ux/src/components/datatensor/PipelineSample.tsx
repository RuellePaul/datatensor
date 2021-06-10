import React, {FC, useCallback, useEffect} from 'react';
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

    const doSample = useCallback(async () => {
        if (pipeline.isLoaded) {
            const operations: Operation[] = pipeline.operations.allIds.map(id => pipeline.operations.byId[id])

            const response = await api.post<{ images: Image[] }>('/augmentor/sample', {
                dataset_id,
                image_id,
                operations,
            })
        }
    }, [pipeline, dataset_id, image_id])

    useEffect(() => {
        doSample()
    }, [doSample]);

    return (
        <div className={clsx(classes.root, className)}>
            ...
        </div>
    );
};

export default PipelineSample;
