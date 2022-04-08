import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import {Box, Divider} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {useSelector} from 'src/store';
import {Theme} from 'src/theme';
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
        maxHeight: 620,
        flexGrow: 1,
        overflowY: 'auto'
    }
}));

const OperationsPipeline: FC<ListProps> = ({className, readOnly, ...rest}) => {
    const classes = useStyles();

    const [dragDisabled, setDragDisabled] = useState<boolean>(false);

    const pipeline = useSelector(state => state.pipeline);

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <div className={classes.inner}>
                <Droppable droppableId="operationsPipeline">
                    {provided => (
                        <div ref={provided.innerRef} className={clsx(classes.droppableArea, 'scroll')}>
                            {pipeline.operations.allTypes.map((operationType, index) => (
                                <Draggable
                                    draggableId={operationType}
                                    index={index}
                                    key={operationType}
                                    isDragDisabled={readOnly || dragDisabled}
                                >
                                    {(provided, snapshot) => {
                                        if (snapshot.isDragging) {
                                            // @ts-ignore
                                            provided.draggableProps.style.left = undefined; // @ts-ignore
                                            provided.draggableProps.style.top = undefined;
                                        }
                                        return (
                                            <Operation
                                                operationType={operationType}
                                                dragging={snapshot.isDragging}
                                                index={index}
                                                key={operationType}
                                                setDragDisabled={setDragDisabled}
                                                // @ts-ignore
                                                ref={provided.innerRef}
                                                readOnly={readOnly}
                                                style={{...provided.draggableProps.style}}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            />
                                        );
                                    }}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                {!readOnly && (
                    <>
                        <Divider light/>
                        <Box pt={1}>
                            <OperationAdd />
                        </Box>
                    </>
                )}
            </div>
        </div>
    );
};

export default OperationsPipeline;
