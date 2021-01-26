import React, {FC} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {useForm} from 'hooks';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1, 0)
    }
}));

interface CaptchaProps {
    name: string
}

const Captcha: FC<CaptchaProps> = ({name}) => {

    const classes = useStyles();

    const {formState, setFormState} = useForm();

    const handleChange = (value: string | null) => {
        setFormState({
            ...formState,
            values: {
                ...formState.values,
                [name]: value
            },
            touched: {
                ...formState.touched,
                [name]: true
            }
        });
    };

    return (
        <div className={classes.root}>
            <ReCAPTCHA
                onChange={handleChange}
                sitekey='6LcFmzcaAAAAAHWoKJ-oEJRO_grEjEjQb0fedPHo'
            />
        </div>
    );
};

export default Captcha;
