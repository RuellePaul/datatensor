import type {FC} from 'react';
import React, {useState} from 'react';
import clsx from 'clsx';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import {Box, Divider, Paper} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {useSelector} from 'src/store';
import type {Theme} from 'src/theme';
import Operation from './Operation';
import OperationAdd from './OperationAdd';


interface ListProps {
    className?: string;
    readOnly?: boolean;
}


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%'
    },
    inner: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflowY: 'hidden',
        overflowX: 'hidden'
    },
    droppableArea: {
        minHeight: 80,
        maxHeight: 500,
        flexGrow: 1,
        overflowY: 'auto',
        padding: theme.spacing(1, 2)
    }
}));

const OperationsPipeline: FC<ListProps> = ({ className, readOnly, ...rest }) => {
    const classes = useStyles();

    const [dragDisabled, setDragDisabled] = useState<boolean>(false);

    const pipeline = useSelector<any>((state) => state.pipeline);

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Paper className={classes.inner}>
                <Droppable
                    droppableId="operationsPipeline"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            className={clsx(classes.droppableArea, 'scroll')}
                        >
                            {pipeline.operations.allIds.map((operationId, index) => (
                                <Draggable
                                    draggableId={operationId}
                                    index={index}
                                    key={operationId}
                                    isDragDisabled={readOnly || dragDisabled}
                                >
                                    {(provided, snapshot) => (
                                        <Operation
                                            operationId={operationId}
                                            dragging={snapshot.isDragging}
                                            index={index}
                                            key={operationId}
                                            setDragDisabled={setDragDisabled}
                                            // @ts-ignore
                                            ref={provided.innerRef}
                                            readOnly={readOnly}
                                            style={{ ...provided.draggableProps.style }}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        />
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                {!readOnly && (
                    <>
                        <Divider />
                        <Box p={2}>
                            <OperationAdd />
                        </Box>
                    </>
                )}
            </Paper>
        </div>
    );
};

export default OperationsPipeline;
