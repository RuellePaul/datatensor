import type {FC} from 'react';
import React, {forwardRef, useState} from 'react';
import clsx from 'clsx';
import {Box, capitalize, Card, CardContent, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import type {Theme} from 'src/theme';
import type {RootState} from 'src/store';
import {useSelector} from 'src/store';
import type {Operation as OperationType} from 'src/types/pipeline';
import OperationEditModal from './OperationEditModal';
import {OPERATIONS_ICONS} from 'src/config';
import ProbabilitySlider from './OperationEditModal/ProbabilitySlider';


interface OperationProps {
    className?: string;
    operationId: string;
    dragging: boolean;
    readOnly?: boolean;
    setDragDisabled?: (update: boolean | ((dataset: boolean) => boolean)) => void;
    index?: number;
    style?: {};
}

interface PopulatedOperation extends OperationType {

}

const operationSelector = (state: RootState, operationId: string): PopulatedOperation => {
    const { operations } = state.pipeline;
    return operations.byId[operationId];
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        outline: 'none',
        padding: theme.spacing(1, 0)
    },
    operation: {
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    content: {
        padding: `${theme.spacing(1.5)} !important`
    },
    dragging: {
        backgroundColor: theme.palette.background.default
    }
}));

const Operation: FC<OperationProps> = forwardRef(({
                                                      operationId,
                                                      className,
                                                      readOnly,
                                                      dragging,
                                                      setDragDisabled,
                                                      index,
                                                      style,
                                                      ...rest
                                                  }, ref) => {
    const classes = useStyles();

    const operation = useSelector((state) => operationSelector(state, operationId));

    const [isOpened, setOpened] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpened(true);
    };

    const handleClose = (): void => {
        setOpened(false);
    };


    return (
        <div
            className={clsx(classes.root, className)}
            index={index}
            // @ts-ignore
            ref={ref}
            style={style}
            {...rest}
        >
            <Card
                className={clsx(
                    classes.operation,
                    { [classes.dragging]: dragging }
                )}
                raised={dragging}
                variant={dragging ? 'elevation' : 'outlined'}
                onClick={handleOpen}
            >
                <CardContent
                    className={classes.content}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        mb={1.5}
                    >
                        <Box mr={2}>
                            {OPERATIONS_ICONS[operation.type]}
                        </Box>
                        <Typography
                            variant="h5"
                            color="textPrimary"
                        >
                            {capitalize(operation.type).replaceAll('_', ' ')}
                        </Typography>
                    </Box>

                    <ProbabilitySlider
                        operation={operation}
                        setDragDisabled={setDragDisabled}
                        disabled={readOnly}
                    />
                </CardContent>
            </Card>
            <OperationEditModal
                open={isOpened}
                onClose={handleClose}
                operation={operation}
            />
        </div>
    );
});

export default Operation;
