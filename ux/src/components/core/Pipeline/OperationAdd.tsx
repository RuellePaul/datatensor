import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Box, Button, capitalize, FormControl, MenuItem, Select} from '@mui/material';
import {Add as AddIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {useDispatch, useSelector} from 'src/store';
import {createOperation} from 'src/slices/pipeline';
import {OperationType} from 'src/types/pipeline';
import {MAX_OPERATIONS_PER_PIPELINE, OPERATIONS_ICONS, OPERATIONS_TYPES} from 'src/config';

interface OperationAddProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    select: {
        paddingLeft: theme.spacing(1)
    }
}));

const OperationAdd: FC<OperationAddProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const [operationType, setOperationType] = useState<OperationType>(OPERATIONS_TYPES[0]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setOperationType(event.target.value as OperationType);
    };

    const handleAddInit = (): void => {
        setExpanded(true);
    };

    const handleAddCancel = (): void => {
        setExpanded(false);
    };

    const handleAddConfirm = async (): Promise<void> => {
        await dispatch(createOperation(operationType));
        setExpanded(false);
    };

    const pipeline = useSelector(state => state.pipeline);

    useEffect(() => {
        if (pipeline.operations.allTypes.includes(operationType))
            setOperationType(OPERATIONS_TYPES.find(type => !pipeline.operations.allTypes.includes(type)))

        // eslint-disable-next-line
    }, [pipeline.operations]);

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            {isExpanded ? (
                <>
                    <FormControl fullWidth variant="filled">
                        <Select
                            classes={{select: classes.select}}
                            fullWidth
                            name="type"
                            onChange={handleChange}
                            value={operationType}
                            variant="filled"
                            startAdornment={OPERATIONS_ICONS[operationType]}
                            renderValue={() => capitalize(operationType).replaceAll('_', ' ')}
                        >
                            {OPERATIONS_TYPES.map(type => (
                                <MenuItem
                                    key={type}
                                    value={type}
                                    disabled={pipeline.operations.allTypes.includes(type)}
                                >
                                    <Box mr={1}>{OPERATIONS_ICONS[type]}</Box>

                                    {capitalize(type).replaceAll('_', ' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button onClick={handleAddCancel} variant="text">
                            Cancel
                        </Button>
                        <Button onClick={handleAddConfirm} variant="contained" color="primary">
                            Add
                        </Button>
                    </Box>
                </>
            ) : (
                <Box display="flex" justifyContent="center">
                    <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddInit}
                        disabled={pipeline.operations.allTypes.length >= MAX_OPERATIONS_PER_PIPELINE}
                    >
                        Add operation
                    </Button>
                </Box>
            )}
        </div>
    );
};

export default OperationAdd;
