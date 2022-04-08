import React, {FC} from 'react';
import {Alert, AlertTitle, Box, capitalize, Card, CardContent, IconButton, SvgIcon, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Close} from '@mui/icons-material';
import {Theme} from 'src/theme';
import {Operation} from 'src/types/pipeline';
import OperationProperties from './OperationProperties';
import {OPERATIONS_DESCRIPTION, OPERATIONS_ICONS} from 'src/config';

interface OperationEditProps {
    className?: string;
    operation: Operation;
    handleClose: () => void;
    readOnly: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 530,
        background: 'rgb(0 0 0 / 85%)',
        boxShadow: '0 0px 5px rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(7px)',
        border: '0 0px 5px rgb(255 255 255 / 20%)'
    },
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    }
}));

const OperationEdit: FC<OperationEditProps> = ({operation, className, handleClose, readOnly = false, ...rest}) => {
    const classes = useStyles();

    if (!operation) return null;

    return (
        <Card className={classes.root} {...rest}>
            <CardContent>
                <Box display="flex" mb={2}>
                    <Box mr={2}>{OPERATIONS_ICONS[operation.type]}</Box>
                    <Typography variant="h5">{capitalize(operation.type).replaceAll('_', ' ')}</Typography>
                    <Box flexGrow={1} />
                    <IconButton size="small" onClick={handleClose}>
                        <SvgIcon>
                            <Close />
                        </SvgIcon>
                    </IconButton>
                </Box>

                <OperationProperties operation={operation} readOnly={readOnly} />

                <Box mt={2}>
                    <Alert icon={false}>
                        <Box display="flex">
                            <Box>
                                <AlertTitle>Details</AlertTitle>

                                {OPERATIONS_DESCRIPTION[operation.type]}
                            </Box>

                            <Box mt={1} ml={2} height={190} sx={{aspectRatio: '1 / 1'}}>
                                <img
                                    src={`/static/images/augmentation/operations/${operation.type}.gif`}
                                    alt={`${operation.type}.gif`}
                                    width="100%"
                                />
                            </Box>
                        </Box>
                    </Alert>
                </Box>
            </CardContent>
        </Card>
    );
};

export default OperationEdit;
