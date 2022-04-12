import React, {FC, forwardRef, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Box,
    capitalize,
    Card,
    CardContent,
    Dialog,
    Fade,
    IconButton,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import {DeleteOutline as DeleteIcon, Settings as SettingsIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {RootState, useDispatch, useSelector} from 'src/store';
import {Operation as OperationType} from 'src/types/pipeline';
import OperationEdit from './OperationEdit';
import {OPERATIONS_ICONS} from 'src/config';
import ProbabilitySlider from './OperationEdit/ProbabilitySlider';
import {deleteOperation} from 'src/slices/pipeline';

interface OperationProps {
    className?: string;
    operationType: string;
    dragging: boolean;
    readOnly?: boolean;
    setDragDisabled?: (update: boolean | ((dataset: boolean) => boolean)) => void;
    index?: number;
    style?: {};
}

interface PopulatedOperation extends OperationType {}

const operationSelector = (state: RootState, operationType: string): PopulatedOperation => {
    const {operations} = state.pipeline;
    return operations.byType[operationType];
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
    },
    tooltip: {
        width: '100%',
        maxWidth: 530,
        padding: 0
    }
}));

const Operation: FC<OperationProps> = forwardRef(
    ({operationType, className, readOnly, dragging, setDragDisabled, index, style, ...rest}, ref) => {
        const classes = useStyles();
        const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));
        const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

        const operation = useSelector(state => operationSelector(state, operationType));
        const dispatch = useDispatch();
        const {enqueueSnackbar} = useSnackbar();

        const [isOpened, setOpened] = useState<boolean>(false);

        const handleToggle = () => {
            setOpened(!isOpened);
        };

        const handleClose = () => {
            setOpened(false);
        };

        const handleDelete = async (): Promise<void> => {
            try {
                await dispatch(deleteOperation(operation.type));
                handleClose();
            } catch (err) {
                console.error(err);
                enqueueSnackbar('Something went wrong', {
                    variant: 'error'
                });
            }
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
                <Tooltip
                    disableHoverListener
                    open={!isMobile && !readOnly && isOpened}
                    TransitionComponent={Fade}
                    classes={{tooltip: classes.tooltip}}
                    title={<OperationEdit operation={operation} handleClose={handleClose} readOnly={readOnly} />}
                    placement={isLargeScreen ? 'right' : 'left'}
                >
                    <Card
                        className={clsx(classes.operation, {[classes.dragging]: dragging})}
                        raised={dragging}
                        variant={dragging ? 'elevation' : 'outlined'}
                    >
                        <CardContent className={classes.content}>
                            <Box display="flex" alignItems="center">
                                <Box mr={2}>{OPERATIONS_ICONS[operation.type]}</Box>
                                <Typography variant="h5" color="textPrimary">
                                    {capitalize(operation.type).replaceAll('_', ' ')}
                                </Typography>
                                <Box flexGrow={1} />
                                {readOnly === false && (
                                    <>
                                        <Tooltip title={isOpened ? 'Close settings' : 'Settings'}>
                                            <IconButton onClick={handleToggle}>
                                                <SettingsIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={handleDelete}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>

                            <ProbabilitySlider
                                operation={operation}
                                setDragDisabled={setDragDisabled}
                                disabled={readOnly}
                            />
                        </CardContent>
                    </Card>
                </Tooltip>

                <Dialog open={isMobile && isOpened && !readOnly} onClose={handleClose}>
                    <OperationEdit operation={operation} handleClose={handleClose} readOnly={readOnly} />
                </Dialog>
            </div>
        );
    }
);

export default Operation;
