import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {Button, CircularProgress, makeStyles} from '@material-ui/core';
import {Delete as DeleteIcon} from '@material-ui/icons';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import api from 'src/utils/api';
import useTasks from 'src/hooks/useTasks';

const useStyles = makeStyles((theme: Theme) => ({
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

interface DeletePipelineActionProps {
    pipeline_id: string;
    callback: () => void;
}

const DeletePipelineAction: FC<DeletePipelineActionProps> = ({pipeline_id, callback}) => {

    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveDataset, pipelines, savePipelines} = useDataset();

    const {tasks} = useTasks();

    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeletePipeline = async () => {
        if (!pipeline_id) return;

        setIsDeleting(true);

        try {
            await api.delete(`/datasets/${dataset.id}/pipelines/${pipeline_id}`);
            callback();
            saveDataset(dataset => ({
                ...dataset,
                augmented_count: dataset.augmented_count - pipelines.find(pipeline => pipeline.id === pipeline_id).image_count
            }))
            savePipelines(pipelines => pipelines.filter(pipeline => pipeline.id !== pipeline_id));
            enqueueSnackbar(`Deleted pipeline & associated images`, {variant: 'info'});
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        } finally {
            setIsDeleting(false);
        }
    }

    const activeTasksCount = tasks
        ? tasks.filter(task => task.status === 'active' && task.dataset_id === dataset.id).length
        : 0;

    if (!pipeline_id)
        return null;

    return (
        <>
            <Button
                className={clsx((activeTasksCount === 0 && !isDeleting) && classes.deleteAction)}
                variant='outlined'
                endIcon={isDeleting
                    ? <CircularProgress
                        className={classes.loader}
                        color="inherit"
                    />
                    : <DeleteIcon/>
                }
                onClick={handleDeletePipeline}
                size='small'
                disabled={isDeleting || activeTasksCount > 0}
            >
                Delete pipeline
            </Button>
        </>
    )
};

export default DeletePipelineAction;
