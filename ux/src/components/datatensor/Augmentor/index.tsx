import type {FC} from 'react';
import React, {useEffect} from 'react';
import type {DropResult} from 'react-beautiful-dnd';
import {DragDropContext} from 'react-beautiful-dnd';
import {useSnackbar} from 'notistack';
import {makeStyles} from '@material-ui/core';
import type {Theme} from 'src/theme';
import {useDispatch, useSelector} from 'src/store';
import {getBoard, moveCard} from 'src/slices/pipeline';
import List from './List';

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
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    }
}));

const PipelineView: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {lists} = useSelector((state) => state.pipeline);
    const {enqueueSnackbar} = useSnackbar();

    const handleDragEnd = async ({source, destination, draggableId}: DropResult): Promise<void> => {
        try {
            // Dropped outside the list
            if (!destination) {
                return;
            }

            // Card has not been moved
            if (
                source.droppableId === destination.droppableId
                && source.index === destination.index
            ) {
                return;
            }

            if (source.droppableId === destination.droppableId) {
                // Moved to the same list on different position
                await dispatch(moveCard(draggableId, destination.index));
            } else {
                // Moved to another list
                await dispatch(moveCard(draggableId, destination.index, destination.droppableId));
            }

            enqueueSnackbar('Card moved', {
                variant: 'success'
            });
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Something went wrong', {
                variant: 'error'
            });
        }
    };

    useEffect(() => {
        dispatch(getBoard());
    }, [dispatch]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={classes.content}>
                <div className={classes.inner}>
                    {lists.allIds.map((listId: string) => (
                        <List
                            key={listId}
                            listId={listId}
                        />
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};

export default PipelineView;
