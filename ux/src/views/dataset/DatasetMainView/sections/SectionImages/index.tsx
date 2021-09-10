import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Box, IconButton, makeStyles, Typography} from '@material-ui/core';
import {ArrowLeft as BackIcon} from '@material-ui/icons';
import FancyLabel from 'src/components/FancyLabel';
import DTImagesList from 'src/components/datatensor/ImagesList';
import DTImagesStack from 'src/components/datatensor/ImagesStack';
import useDataset from 'src/hooks/useDataset';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import UploadAction from './UploadAction';
import ViewPipelineAction from './ViewPipelineAction';
import DeletePipelineAction from './DeletePipelineAction';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    label: {
        margin: theme.spacing(1, 2, 1, 0)
    }
}));

interface ImagesStackPanelProps {
    title: string;
    pipeline_id?: string;
}


const ImagesStackPanel: FC<ImagesStackPanelProps> = ({title, pipeline_id}) => {

    const {savePipelines} = useDataset();
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
        >
            <Typography
                variant='h5'
                color={pipeline_id ? 'textSecondary' : 'textPrimary'}
                gutterBottom
                align='center'
            >
                <strong>
                    {title}
                </strong>
            </Typography>
            {selected
                ? (
                    <>
                        {pipeline_id
                            ? (
                                <>
                                    <ViewPipelineAction
                                        pipeline_id={pipeline_id}
                                    />
                                    <DeletePipelineAction
                                        pipeline_id={pipeline_id}
                                        callback={() => savePipelines(pipelines => pipelines.filter(pipeline => pipeline.id !== pipeline_id))}
                                    />
                                </>
                            ) : (
                                <UploadAction/>
                            )}
                        <IconButton onClick={() => setSelected(false)}>
                            <BackIcon/>
                        </IconButton>
                        <DTImagesList pipeline_id={pipeline_id}/>
                    </>
                ) : (
                    <DTImagesStack
                        onClick={() => setSelected(true)}
                    />
                )}
        </Box>

    )
}


const SectionImages: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    const {dataset, pipelines} = useDataset();

    return (
        <div className={clsx(classes.root, className)}>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                All images
            </Typography>

            <Typography
                color="textPrimary"
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
