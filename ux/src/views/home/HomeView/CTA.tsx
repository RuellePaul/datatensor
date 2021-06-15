import React, {FC} from 'react';
import clsx from 'clsx';
import {Container, Link, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Link as RouterLink} from 'react-router-dom';

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

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Container component='section' maxWidth="lg">
                <Typography
                    variant="h1"
                    align="center"
                    color="textPrimary"
                >
                    Ready to start building?
                </Typography>
                <Link
                    variant="h2"
                    color="secondary"
                    component={RouterLink}
                    to="/app"
                >
                    Login to Datatensor
                </Link>
            </Container>
        </div>
    );
};

export default CTA;
