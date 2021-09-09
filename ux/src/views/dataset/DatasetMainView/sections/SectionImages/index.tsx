import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Box, makeStyles, Typography} from '@material-ui/core';
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
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            justifyContent: 'center',
            '& > div': {
                margin: theme.spacing(2, 0)
            }
        },
        margin: theme.spacing(2, 0)
    },
    label: {
        margin: theme.spacing(1, 2, 1, 0)
    }
}));


const SectionImages: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    const {dataset, pipelines} = useDataset();

    const [pipelineId, setPipelineId] = useState<string | null>(null);

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

            <UploadAction/>
            <ViewPipelineAction
                pipeline_id={pipelineId}
            />
            <DeletePipelineAction
                pipeline_id={pipelineId}
                callback={() => setPipelineId(null)}
            />

            <div
                className={classes.wrapper}
            >
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    width='100%'
                >
                    <Typography
                        variant='overline'
                        color='textPrimary'
                        gutterBottom
                        align='center'
                    >
                        Original images ({dataset.image_count})
                    </Typography>
                    <DTImagesStack
                        onClick={() => setPipelineId(null)}
                    />
                </Box>

                {pipelines.map(pipeline => (
                    <ImagesProvider
                        key={pipeline.id}
                    >
                        <Box
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'
                            alignItems='center'
                            width='100%'
                        >
                            <Typography
                                variant='overline'
                                color='textPrimary'
                                gutterBottom
                                align='center'
                            >
                                Augmented images ({pipeline.image_count})
                            </Typography>
                            <DTImagesStack
                                onClick={() => setPipelineId(pipeline.id)}
                            />
                        </Box>
                    </ImagesProvider>
                ))}
            </div>

            <DTImagesList/>
        </div>
    )
};

export default SectionImages;
