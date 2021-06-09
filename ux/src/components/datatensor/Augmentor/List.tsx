import type {FC} from 'react';
import React from 'react';
import clsx from 'clsx';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import {Box, Divider, makeStyles, Paper} from '@material-ui/core';
import {useSelector} from 'src/store';
import type {Theme} from 'src/theme';
import Operation from './Operation';
import OperationAdd from './OperationAdd';

interface ListProps {
    className?: string;
}


const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    inner: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflowY: 'hidden',
        overflowX: 'hidden',
        width: 380,
        [theme.breakpoints.down('xs')]: {
            width: 300
        }
    },
    title: {
        cursor: 'pointer'
    },
    droppableArea: {
        minHeight: 80,
        flexGrow: 1,
        overflowY: 'auto',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    menu: {
        width: 240
    }
}));

const List: FC<ListProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const pipeline = useSelector<any>((state) => state.pipeline);
    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Paper className={classes.inner}>
                <Droppable
                    droppableId='operationsPipeline'
                    type="card"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            className={classes.droppableArea}
                        >
                            {pipeline.operations.allIds.map((operationId, index) => (
                                <Draggable
                                    draggableId={operationId}
                                    index={index}
                                    key={operationId}
                                >
                                    {(provided, snapshot) => (
                                        <Operation
                                            operationId={operationId}
                                            dragging={snapshot.isDragging}
                                            index={index}
                                            key={operationId}
                                            // @ts-ignore
                                            ref={provided.innerRef}
                                            style={{...provided.draggableProps.style}}
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
                <Divider/>
                <Box p={2}>
                    <OperationAdd/>
                </Box>
            </Paper>
            <pre>
                {JSON.stringify(pipeline, null, 4)}
            </pre>

        </div>
    );
};

export default List;
