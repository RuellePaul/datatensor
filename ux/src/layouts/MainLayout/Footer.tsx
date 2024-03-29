import React, {FC} from 'react';
import {Link as RouterLink, useHistory, useLocation} from 'react-router-dom';
import {Formik} from 'formik';
import {useSnackbar} from 'notistack';
import * as Yup from 'yup';
import {Box, Button, Container, Divider, IconButton, Link, TextField, Typography} from '@mui/material';
import {Coffee as CoffeeIcon, GitHub as GithubIcon, LinkedIn as LinkedInIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import Logo from 'src/components/utils/Logo';
import goToHash from 'src/utils/goToHash';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import api from 'src/utils/api';

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.background.paper,
        '& .MuiLink-root': {
            display: 'block'
        }
    },
    wrapper: {
        padding: theme.spacing(6, 0),
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column'
        }
    },
    block: {
        padding: theme.spacing(2),
        minWidth: 200,
        [theme.breakpoints.down('md')]: {
            padding: 0,
            paddingTop: theme.spacing(3)
        }
    }
}));

const NewsletterForm = () => {
    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <Formik
            initialValues={{
                email: ''
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Must be a valid email.')
                    .max(255)
            })}
            onSubmit={async (values, {setStatus, setSubmitting, resetForm}) => {
                try {
                    await api.post('/public/newsletter', {email: values.email});
                    resetForm();
                    enqueueSnackbar('Newsletter subscription confirmed !', {variant: 'success'});

                    if (isMountedRef.current) {
                        setStatus({success: true});
                        setSubmitting(false);
                    }
                } catch (error) {
                    if (isMountedRef.current) {
                        setStatus({success: false});
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Box display="flex" alignItems="center" mt={2} maxWidth={400}>
                        <TextField
                            error={Boolean(touched.email && errors.email)}
                            fullWidth
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Enter your email"
                            name="email"
                            value={values.email}
                            variant="filled"
                            size="small"
                            sx={{mr: 2}}
                        />
                        <Button color="primary" disabled={isSubmitting} type="submit">
                            Subscribe
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

const Footer: FC = () => {
    const classes = useStyles();

    const history = useHistory();
    const location = useLocation();

    return (
        <div className={classes.root}>
            <Container component="section" maxWidth="md">
                <Box className={classes.wrapper}>
                    <Box>
                        <RouterLink to="/">
                            <Box display="flex" alignItems="center" mb={2.5}>
                                <Logo />

                                <Typography variant="overline" component="p" color="textPrimary" sx={{ml: 2}}>
                                    Datatensor
                                </Typography>
                            </Box>
                        </RouterLink>

                        <Typography variant="body1" color="textPrimary" fontWeight={600}>
                            Keep up to date
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Join our newsletter for regular updates. No spam ever.
                        </Typography>

                        <NewsletterForm />
                    </Box>

                    <Box flexGrow={1} />

                    <Box display="flex">
                        <Box className={classes.block}>
                            <Typography variant="body1" color="textPrimary" fontWeight={600} gutterBottom>
                                Product
                            </Typography>
                            <Link
                                onClick={() => {
                                    location.pathname === '/' ? goToHash('features') : history.push('/#features');
                                }}
                                variant="body1"
                                color="textSecondary"
                            >
                                Features
                            </Link>
                            <Link
                                component={RouterLink}
                                to="/docs/getting-started"
                                variant="body1"
                                color="textSecondary"
                            >
                                Documentation
                            </Link>
                            <Link component={RouterLink} to="/" variant="body1" color="textSecondary">
                                Roadmap
                            </Link>
                        </Box>
                        <Box className={classes.block}>
                            <Typography variant="body1" color="textPrimary" fontWeight={600} gutterBottom>
                                Company
                            </Typography>
                            <Link
                                component={RouterLink}
                                to="/docs/about-datatensor"
                                variant="body1"
                                color="textSecondary"
                            >
                                About
                            </Link>
                            <Link component={RouterLink} to="/terms" variant="body1" color="textSecondary">
                                Terms
                            </Link>
                            <Link component={RouterLink} to="/privacy" variant="body1" color="textSecondary">
                                Privacy
                            </Link>
                        </Box>
                    </Box>
                </Box>

                <Divider />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        pt: 2,
                        pb: 4
                    }}
                >
                    <Typography variant="body2" color="textSecondary">
                        Copyright © 2022 Datatensor
                    </Typography>

                    <Box display="flex" alignItems="center">
                        <IconButton
                            onClick={() =>
                                window.open('https://github.com/RuellePaul/datatensor.git', '_blank', 'noopener')
                            }
                        >
                            <GithubIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => window.open('https://www.linkedin.com/in/paulruelle/', '_blank', 'noopener')}
                        >
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => window.open('https://www.buymeacoffee.com/ruellepaul', '_blank', 'noopener')}
                        >
                            <CoffeeIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default Footer;
