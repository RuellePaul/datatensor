import type {FC} from 'react';
import React, {forwardRef, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {Card, CardContent, CardMedia, makeStyles, Typography} from '@material-ui/core';
import type {Theme} from 'src/theme';
import type {RootState} from 'src/store';
import {useSelector} from 'src/store';
import type {Operation as OperationType} from 'src/types/pipeline';
import OperationEditModal from './OperationEditModal';

interface OperationProps {
    className?: string;
    operationId: string;
    dragging: boolean;
    index?: number;
    style?: {};
}

interface PopulatedOperation extends OperationType {

}

const operationSelector = (state: RootState, operationId: string): PopulatedOperation => {
    const {operations,} = state.pipeline;
    return operations.byId[operationId]
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        outline: 'none',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    operation: {
        '&:hover': {
            backgroundColor: theme.palette.background.dark
        }
    },
    dragging: {
        backgroundColor: theme.palette.background.dark
    },
    cover: {
        height: 200
    },
    badge: {
        '& + &': {
            marginLeft: theme.spacing(2)
        }
    }
}));

const Operation: FC<OperationProps> = forwardRef(({
                                                      operationId,
                                                      className,
                                                      dragging,
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
                    {[classes.dragging]: dragging}
                )}
                raised={dragging}
                variant={dragging ? 'elevation' : 'outlined'}
                onClick={handleOpen}
            >
                {operation.cover && (
                    <CardMedia
                        className={classes.cover}
                        image={operation.cover}
                    />
                )}
                <CardContent>
                    <Typography
                        variant="h5"
                        color="textPrimary"
                    >
                        {operation.name}
                    </Typography>
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

Operation.propTypes = {
    operationId: PropTypes.string.isRequired,
    className: PropTypes.string,
    dragging: PropTypes.bool.isRequired,
    index: PropTypes.number,
    // @ts-ignore
    style: PropTypes.object
};

Operation.defaultProps = {
    dragging: false,
    style: {}
};

export default Operation;
