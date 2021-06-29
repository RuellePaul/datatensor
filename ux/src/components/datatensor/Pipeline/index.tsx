import type {FC} from 'react';
import React, {useEffect} from 'react';
import type {DropResult} from 'react-beautiful-dnd';
import {DragDropContext} from 'react-beautiful-dnd';
import {makeStyles} from '@material-ui/core';
import type {Theme} from 'src/theme';
import {useDispatch} from 'src/store';
import {moveOperation, setDefaultPipeline} from 'src/slices/pipeline';
import OperationsPipeline from './OperationsPipeline';

interface PipelineProps {

}

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        display: 'flex',
        overflow: 'hidden',
    }
}));

const Pipeline: FC<PipelineProps> = () => {
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
            console.error(err);
            try {
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
                <OperationsPipeline/>
            </div>
        </DragDropContext>
    );
};

export default Pipeline;
