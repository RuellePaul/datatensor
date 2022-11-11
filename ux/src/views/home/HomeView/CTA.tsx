import React, {FC} from 'react';
import {useHistory} from 'react-router';
import clsx from 'clsx';

import {Button, Container, Typography} from '@mui/material';
import {Login as LoginIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';

interface CTAProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        paddingTop: 128,
        paddingBottom: 128,
        textAlign: 'center'
    }
}));

const CTA: FC<CTAProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Container component="section" maxWidth="lg">
                <Typography variant="h1" align="center" color="textPrimary">
                    Get started with Datatensor today.
                </Typography>
                <Button
                    color="primary"
                    onClick={() => history.push('/auth/register')}
                    size="large"
                    variant="contained"
                    sx={{mt: 2}}
                    endIcon={<LoginIcon />}
                >
                    Register now
                </Button>
            </Container>
        </div>
    );
};

export default CTA;
