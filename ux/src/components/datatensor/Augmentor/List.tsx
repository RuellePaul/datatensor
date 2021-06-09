import type {FC} from 'react';
import React from 'react';
import clsx from 'clsx';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import {Box, Divider, makeStyles, Paper, Typography} from '@material-ui/core';
import type {Theme} from 'src/theme';
import type {RootState} from 'src/store';
import {useSelector} from 'src/store';
import type {List as ListType} from 'src/types/pipeline';
import Operation from './Operation';
import OperationAdd from './OperationAdd';

interface ListProps {
    className?: string;
    listId: string;
}

const listSelector = (state: RootState, listId: string): ListType => {
    const {lists} = state.pipeline;

    return lists.byId[listId];
};

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

const List: FC<ListProps> = ({className, listId, ...rest}) => {
    const classes = useStyles();
    const list = useSelector((state) => listSelector(state, listId));
    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Paper className={classes.inner}>
                <Box
                    p={2}
                    display="flex"
                    alignItems="center"
                >
                    <Typography
                        color="inherit"
                        variant="h5"
                    >
                        {list.name}
                    </Typography>
                </Box>
                <Divider/>
                <Droppable
                    droppableId={list.id}
                    type="card"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            className={classes.droppableArea}
                        >
                            {list.operationIds.map((operationId, index) => (
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
                    <OperationAdd listId={list.id}/>
                </Box>
            </Paper>
        </div>
    );
};

export default List;
