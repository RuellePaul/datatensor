import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, makeStyles, Typography} from '@material-ui/core';
import FancyLabel from 'src/components/FancyLabel';
import useDataset from 'src/hooks/useDataset';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Theme} from 'src/theme';
import ImagesStackPanel from './ImagesStackPanel';
import {SectionProps} from '../SectionProps';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    label: {
        margin: theme.spacing(1, 2, 1, 0)
    },
    title: {
        position: 'relative',
        '&:after': {
            position: 'absolute',
            bottom: -8,
            left: 0,
            content: '" "',
            height: 3,
            width: 68,
            backgroundColor: theme.palette.primary.main
        }
    },
}));

const SectionImages: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    const {dataset, pipelines} = useDataset();

    return (
        <div className={clsx(classes.root, className)}>
            <Box mb={3}>
                <Typography
                    className={classes.title}
                    variant="h4"
                    color="textPrimary"
                >
                    All images
                </Typography>
            </Box>

            <Typography
                color="textPrimary"
                gutterBottom
            >
                Currently, this dataset contains
                {' '}
                <strong>
                    {dataset.image_count + dataset.augmented_count} images :
                </strong>
                {' '}
                <FancyLabel
                    className={classes.label}
                    color='info'
                >
                    {dataset.image_count} original
                </FancyLabel>
                <FancyLabel
                    className={classes.label}
                    color='default'
                >
                    + {dataset.augmented_count} augmented
                </FancyLabel>
            </Typography>

            <ImagesStackPanel
                title={`Original images (${dataset.image_count})`}
            />

            {pipelines.map(pipeline => (
                <ImagesProvider
                    key={pipeline.id}
                    pipeline_id={pipeline.id}
                >
                    <ImagesStackPanel
                        title={`Augmented images (${pipeline.image_count})`}
                        pipeline_id={pipeline.id}
                    />
                </ImagesProvider>
            ))}
        </div>
    )
};

export default SectionImages;
