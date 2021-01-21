import React, {FC} from 'react';
import {useForm} from 'hooks';

import {Button, ButtonProps} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1, 0)
    }
}));

interface DefaultProps {
    label: string,
    disabled?: boolean,
    submit?: boolean
}

const Default: FC<DefaultProps & ButtonProps> = ({label, submit, disabled, ...rest}) => {

    const classes = useStyles();

    const {formState} = useForm();

    return (
        <Button
            className={classes.root}
            color='primary'
            fullWidth
            type={submit ? 'submit' : 'button'}
            size='large'
            variant='contained'
            disabled={submit ? !formState.isValid : disabled}
            {...rest}
        >
            {label}
        </Button>
    )
};

export default Default;