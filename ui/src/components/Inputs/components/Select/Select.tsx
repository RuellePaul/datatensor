import React, {FC} from 'react';
import {useForm} from 'hooks';

import {FormControl, FormHelperText, InputLabel, MenuItem, Select as MuiSelect, SelectProps} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 120,
        margin: theme.spacing(1, 0)
    }
}));

interface SelectInterface {
    name: string,
    options: { label: string, value: string }[],
    label?: React.ReactNode,
    helper?: React.ReactNode
}

const Select: FC<SelectProps & SelectInterface> = ({name, options, label, helper, ...rest}) => {

    const classes = useStyles();

    const {formState, setFormState} = useForm();

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setFormState({
            ...formState,
            values: {
                ...formState.values,
                [name]: event.target.value
            },
            touched: {
                ...formState.touched,
                [name]: true
            }
        });
    };

    // @ts-ignore
    const hasError = (field: string) => !!(formState.touched[field] && formState.errors[field]);
    // @ts-ignore
    const error = hasError(name) ? formState.errors[name][0] : null;

    // @ts-ignore
    return (
        <FormControl>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <MuiSelect
                className={classes.root}
                name={name}
                // @ts-ignore
                value={formState.values[name] || ''}
                onChange={handleChange}
                error={hasError(name)}
                type='primary'
                fullWidth
                spellCheck={false}
                {...rest}
            >
                {options.map((option: { label: string, value: string }) => <MenuItem
                    key={`item-${option.value}`}
                    value={option.value}>{option.label}
                </MenuItem>)}
            </MuiSelect>

            <FormHelperText>
                {error}
            </FormHelperText>
        </FormControl>
    )
};

export default Select;