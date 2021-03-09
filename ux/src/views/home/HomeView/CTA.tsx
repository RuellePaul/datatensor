import React, {FC} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Box, Button, Container, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';

interface CTAProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        paddingTop: 128,
        paddingBottom: 128
    },
    browseButton: {
        marginLeft: theme.spacing(2)
    }
}));

const CTA: FC<CTAProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h1"
                    align="center"
                    color="textPrimary"
                >
                    Ready to start building?
                </Typography>
                <Typography
                    variant="h1"
                    align="center"
                    color="secondary"
                >
                    Download Devias Material Kit today.
                </Typography>
                <Box
                    mt={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button
                        color="secondary"
                        component="a"
                        href="https://material-ui.com/store/items/devias-kit-pro"
                        variant="contained"
                    >
                        Get the kit
                    </Button>
                </Box>
            </Container>
        </div>
    );
};

CTA.propTypes = {
    className: PropTypes.string
};

export default CTA;
