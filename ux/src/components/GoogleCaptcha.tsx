import React, {FC, ReactNode} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface GoogleCaptchaProps {
    name: string;
    onChange: (name: string) => void;
}

const GoogleCaptcha: FC<GoogleCaptchaProps> = ({...rest}) => (
    <ReCAPTCHA
        sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY}
        {...rest}
    />
);

export default GoogleCaptcha;
