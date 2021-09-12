import React, {FC, useState} from 'react';
import {Box, Button, Card, CardContent, CardHeader, makeStyles, Typography} from '@material-ui/core';
import {ArrowLeft as BackIcon} from 'react-feather';
import DTImagesList from 'src/components/datatensor/ImagesList';
import DTImagesStack from 'src/components/datatensor/ImagesStack';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import UploadAction from './UploadAction';
import ViewPipelineAction from './ViewPipelineAction';
import DeletePipelineAction from './DeletePipelineAction';
import useImages from 'src/hooks/useImages';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBottom: theme.spacing(3),
        '& .MuiCardHeader-action': {
            margin: 0
        }
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        padding: `${theme.spacing(0, 2)} !important`,
    },
    header: {
        borderBottom: `1px dashed ${theme.palette.divider}`,
        marginBottom: theme.spacing(1)
    }
}));

interface ImagesStackPanelProps {
    title: string;
    pipeline_id?: string;
}


const ImagesStackPanel: FC<ImagesStackPanelProps> = ({title, pipeline_id}) => {

    const classes = useStyles();
    const {dataset, pipelines, savePipelines} = useDataset();
    const {images} = useImages();
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <Card
            className={classes.root}
            elevation={5}
            variant='outlined'
        >
            <CardHeader
                className={classes.header}
                action={pipeline_id
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
                    )
                }
                title={title}
            />
            <CardContent className={classes.content}>
                {selected
                    ? (
                        <div>
                            <Box
                                display='flex'
                                alignItems='center'
                                justifyContent='space-between'
                                mb={2}
                            >
                                <Button
                                    onClick={() => setSelected(false)}
                                    size='small'
                                    startIcon={<BackIcon/>}
                                >
                                    Back
                                </Button>
                                <Typography
                                    variant='body2'
                                    color='textSecondary'
                                >
                                    {images.length} / {pipeline_id
                                    ? pipelines.find(pipeline => pipeline.id === pipeline_id).image_count
                                    : dataset.image_count}
                                </Typography>
                            </Box>
                            <DTImagesList pipeline_id={pipeline_id}/>
                        </div>
                    ) : (
                        <DTImagesStack
                            onClick={() => setSelected(true)}
                        />
                    )}
            </CardContent>
        </Card>
    )
}

export default ImagesStackPanel;
