import type {FC} from 'react';
import React, {useEffect} from 'react';
import type {DropResult} from 'react-beautiful-dnd';
import {DragDropContext} from 'react-beautiful-dnd';
import {makeStyles} from '@material-ui/core';
import type {Theme} from 'src/theme';
import {useDispatch} from 'src/store';
import {setDefaultPipeline, moveOperation} from 'src/slices/pipeline';
import Pipeline from './Pipeline';

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        flexGrow: 1,
        flexShrink: 1,
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto'
    },
    inner: {
        display: 'flex',
        padding: theme.spacing(3, 1)
    }
}));

const PipelineView: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleDragEnd = async ({source, destination, draggableId}: DropResult): Promise<void> => {
        try {
            // Dropped outside the list
            if (!destination)
                return;

            // Operation has not been moved
            if (source.droppableId === destination.droppableId && source.index === destination.index)
                return;

            await dispatch(moveOperation(draggableId, destination.index));
        } catch (err) {
            console.error(err);        try {
            // Dropped outside the list
            if (!destination)
                return;

            // Operation has not been moved
            if (source.droppableId === destination.droppableId && source.index === destination.index)
                return;

            await dispatch(moveOperation(draggableId, destination.index));
        } catch (err) {
            console.error(err);
        }
        }
    };

    useEffect(() => {
        dispatch(setDefaultPipeline());
    }, [dispatch]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={classes.content}>
                <div className={classes.inner}>
                    <Pipeline/>
                </div>
            </div>
        </DragDropContext>
    );
};

export default PipelineView;
