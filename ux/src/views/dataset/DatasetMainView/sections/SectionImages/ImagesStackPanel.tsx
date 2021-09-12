import React, {FC, useState} from 'react';
import {Button, Card, CardContent, CardHeader, makeStyles} from '@material-ui/core';
import {ArrowLeft as BackIcon} from 'react-feather';
import DTImagesList from 'src/components/datatensor/ImagesList';
import DTImagesStack from 'src/components/datatensor/ImagesStack';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import UploadAction from './UploadAction';
import ViewPipelineAction from './ViewPipelineAction';
import DeletePipelineAction from './DeletePipelineAction';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBottom: theme.spacing(3)
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        padding: `${theme.spacing(0, 2)} !important`,
    }
}));

interface ImagesStackPanelProps {
    title: string;
    pipeline_id?: string;
}


const ImagesStackPanel: FC<ImagesStackPanelProps> = ({title, pipeline_id}) => {

    const classes = useStyles();
    const {savePipelines} = useDataset();
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <Card className={classes.root}>
            <CardHeader
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
                            <Button
                                onClick={() => setSelected(false)}
                                size='small'
                                startIcon={<BackIcon/>}
                            >
                                Back
                            </Button>
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
