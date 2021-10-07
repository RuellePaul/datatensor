import React, {FC} from 'react';
import {Button, SvgIcon} from '@mui/material';
import {makeStyles} from '@mui/styles';
import api from 'src/utils/api';
import {useSnackbar} from 'notistack';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(1)
    }
}));

export const GoogleIcon: FC = () => {
    return (
        <SvgIcon viewBox="0 0 533.5 544.3">
            <path
                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                fill="#4285f4"
            />
            <path
                d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                fill="#34a853"
            />
            <path
                d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                fill="#fbbc04"
            />
            <path
                d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                fill="#ea4335"
            />
        </SvgIcon>
    );
};

export const GithubIcon: FC = () => {
    return (
        <SvgIcon>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </SvgIcon>
    );
};

export const StackoverflowIcon: FC = () => {
    return (
        <SvgIcon viewBox="0 0 120 120">
            <path d="M84.4 93.8V70.6h7.7v30.9H22.6V70.6h7.7v23.2z" fill="#bcbbbb" />
            <path
                d="M38.8 68.4l37.8 7.9 1.6-7.6-37.8-7.9-1.6 7.6zm5-18l35 16.3 3.2-7-35-16.4-3.2 7.1zm9.7-17.2l29.7 24.7 4.9-5.9-29.7-24.7-4.9 5.9zm19.2-18.3l-6.2 4.6 23 31 6.2-4.6-23-31zM38 86h38.6v-7.7H38V86z"
                fill="#f48023"
            />
        </SvgIcon>
    );
};

const OAUTH_ICONS = {
    google: <GoogleIcon />,
    github: <GithubIcon />,
    stackoverflow: <StackoverflowIcon />
};

interface OAuthLoginButtonProps {
    scope: 'github' | 'google' | 'stackoverflow';
}

const OAuthLoginButton: FC<OAuthLoginButtonProps> = ({scope}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <Button
            className={classes.root}
            onClick={async () => {
                try {
                    const response = await api.get<{authorization_url: string}>(`/oauth/authorization/${scope}`);
                    const {authorization_url} = response.data;
                    window.location.href = authorization_url;
                } catch (error) {
                    enqueueSnackbar(error.message || 'Something went wrong', {
                        variant: 'error'
                    });
                }
            }}
            color="inherit"
            size="large"
            variant="outlined"
        >
            {OAUTH_ICONS[scope]}
            &nbsp;
            {scope}
        </Button>
    );
};

export default OAuthLoginButton;
