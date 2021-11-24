import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Breadcrumbs, Grid, Link} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Theme} from 'src/theme';
import {UserConsumer} from 'src/store/UserContext';
import UserAvatar from 'src/components/UserAvatar';

interface HeaderProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    avatar: {
        width: 24,
        height: 24,
        marginRight: theme.spacing(1)
    }
}));

const Header: FC<HeaderProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <Grid container spacing={3} justifyContent="space-between" className={clsx(classes.root, className)} {...rest}>
            <Grid item>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link variant="body1" color="text.primary" to="/app/datasets" component={RouterLink}>
                        Datasets
                    </Link>

                    <UserConsumer>
                        {value => (
                            <Box display="flex" alignItems="center">
                                <UserAvatar className={classes.avatar} user={value.user} disableBadge />
                                <Link
                                    variant="body1"
                                    color="text.primary"
                                    to={`/app/users/${value.user.id}/details`}
                                    component={RouterLink}
                                >
                                    {value.user.name}
                                </Link>
                            </Box>
                        )}
                    </UserConsumer>
                </Breadcrumbs>
            </Grid>
        </Grid>
    );
};

export default Header;
