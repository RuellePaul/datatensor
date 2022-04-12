import React, {useEffect, FC} from 'react';
import {DropResult} from 'react-beautiful-dnd';
import {DragDropContext} from 'react-beautiful-dnd';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {useDispatch} from 'src/store';
import {moveOperation, setDefaultPipeline} from 'src/slices/pipeline';
import OperationsPipeline from './OperationsPipeline';

interface PipelineProps {
    className?: string;
    readOnly?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 380,
        flexGrow: 1,
        flexShrink: 1,
        display: 'flex',
        overflow: 'hidden'
    }
}));

const Pipeline: FC<PipelineProps> = ({className, readOnly = false}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleDragEnd = async ({source, destination, draggableId}: DropResult): Promise<void> => {
        try {
            // Dropped outside the list
            if (!destination) return;

            // Operation has not been moved
            if (source.droppableId === destination.droppableId && source.index === destination.index) return;

            await dispatch(moveOperation(draggableId, destination.index));
        } catch (err) {
            console.error(err);
            try {
                // Dropped outside the list
                if (!destination) return;

                // Operation has not been moved
                if (source.droppableId === destination.droppableId && source.index === destination.index) return;

                await dispatch(moveOperation(draggableId, destination.index));
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        if (!readOnly) dispatch(setDefaultPipeline());
    }, [dispatch, readOnly]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={clsx(classes.root, className)}>
                <OperationsPipeline readOnly={readOnly} />
            </div>
        </DragDropContext>
    );
};

export default Pipeline;
