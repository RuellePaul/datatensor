import React, {FC} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {FormHelperText} from '@mui/material';


interface GoogleCaptchaProps {
    name: string;
    onChange: (name: string) => void;
    helperText?: string;
}

const GoogleCaptcha: FC<GoogleCaptchaProps> = ({helperText, ...rest}) => (
    <>
        <ReCAPTCHA sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY} {...rest} />
        <FormHelperText error>{helperText}</FormHelperText>
    </>
);

export default GoogleCaptcha;
