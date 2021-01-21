import React, {FC} from 'react';
import {useForm} from 'hooks';

import {TextField, TextFieldProps} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1, 0, 2)
    }
}));

interface TextProps {
    name: string
}

const Text: FC<TextProps & TextFieldProps> = ({name, ...rest}) => {

    const classes = useStyles();

    const {formState, setFormState} = useForm();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            values: {
                ...formState.values,
                [name]: event.target.value
            }
        });
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.value && setFormState({
            ...formState,
            touched: {
                ...formState.touched,
                [name]: true
            }
        });
    };

    // @ts-ignore
    const hasError = (field: string) => !!(formState.touched[field] && formState.errors[field]);

    return (
        <TextField
            className={classes.root}
            name={name}
            // @ts-ignore
            value={formState.values[name] || ''}
            onBlur={handleBlur}
            onChange={handleChange}

            error={hasError(name)}
            // @ts-ignore
            helperText={hasError(name) ? formState.errors[name][0] : null}

            spellCheck={false}
            type='primary'
            fullWidth
            {...rest}
        />
    )
};

export default Text;