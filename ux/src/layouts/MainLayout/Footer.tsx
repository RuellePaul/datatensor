import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Button, Container, Divider, Grid, IconButton, Link, TextField, Typography} from '@mui/material';
import {Coffee as CoffeIcon, GitHub as GithubIcon, LinkedIn as LinkedInIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import Logo from 'src/components/utils/Logo';

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.background.paper,
        '& .MuiLink-root': {
            display: 'block'
        }
    }
}));

const Footer: FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Container component="section" maxWidth="lg">
                <Grid container sx={{pt: 8, pb: 4}}>
                    <Grid item xs={12} md={5}>
                        <RouterLink to="/">
                            <Box display="flex" alignItems="center" mb={3}>
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

                        <Box display="flex" alignItems="center" mt={2} maxWidth={350}>
                            <TextField
                                fullWidth
                                label="Enter your email"
                                name="email"
                                variant="filled"
                                size="small"
                                sx={{mr: 2}}
                            />
                            <Button>Subscribe</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="body1" color="textPrimary" fontWeight={600} gutterBottom>
                            Product
                        </Typography>
                        <Link component={RouterLink} to="/" variant="body1" color="textSecondary">
                            Features
                        </Link>
                        <Link component={RouterLink} to="/" variant="body1" color="textSecondary">
                            Documentation
                        </Link>
                        <Link component={RouterLink} to="/" variant="body1" color="textSecondary">
                            Roadmap
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="body1" color="textPrimary" fontWeight={600} gutterBottom>
                            Company
                        </Typography>
                        <Link component={RouterLink} to="/" variant="body1" color="textSecondary">
                            About
                        </Link>
                        <Link component={RouterLink} to="/" variant="body1" color="textSecondary">
                            Vision
                        </Link>
                        <Link component={RouterLink} to="/" variant="body1" color="textSecondary">
                            Terms
                        </Link>
                        <Link component={RouterLink} to="/" variant="body1" color="textSecondary">
                            Privacy
                        </Link>
                    </Grid>
                </Grid>

                <Divider />

                <Box display="flex" alignItems="center" justifyContent="space-between" py={4} width="100%">
                    <Typography variant="body2" color="textSecondary">
                        Copyright © 2022 Datatensor
                    </Typography>

                    <Box display="flex" alignItems="center">
                        <IconButton component={RouterLink} to="/">
                            <GithubIcon />
                        </IconButton>
                        <IconButton component={RouterLink} to="/">
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton component={RouterLink} to="/">
                            <CoffeIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default Footer;
