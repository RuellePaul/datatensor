import type {FC} from 'react';
import React from 'react';
import {Slider, Typography} from '@material-ui/core';
import {useDispatch} from 'src/store';
import type {Operation} from 'src/types/pipeline';
import {updateOperation} from 'src/slices/pipeline';

interface OperationPropertiesProps {
    operation: Operation,
}

const OperationProperties: FC<OperationPropertiesProps> = ({operation}) => {
    const dispatch = useDispatch();

    const handlePropertiesChange = async (event, value): Promise<void> => {
        try {
            await dispatch(updateOperation(operation.id, {properties: value}));
        } catch (err) {
            console.error(err);
        }
    };

    // TODO : Formik here
    return (
        <>
            <Typography
                variant='overline'
                color='textSecondary'
            >
                Properties
            </Typography>
            
            {operation.type}
        </>
    );
}

export default OperationProperties;