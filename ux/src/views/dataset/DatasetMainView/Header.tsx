import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Breadcrumbs, capitalize, Chip, Grid, Link, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Lock as PrivateIcon, NavigateNext as NavigateNextIcon, Public as PublicIcon} from '@mui/icons-material';
import WorkingAlert from 'src/components/core/WorkingAlert';
import useDataset from 'src/hooks/useDataset';
import {UserConsumer} from 'src/store/UserContext';
import UserAvatar from 'src/components/UserAvatar';
import {Theme} from 'src/theme';

interface HeaderProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            '& ol li:first-child, li:first-child + li': {
                display: 'none'
            }
        }
    },
    alert: {
        position: 'absolute',
        top: 4,
        right: 0,
        margin: 0
    },
    chip: {
        marginLeft: theme.spacing(1)
    },
    avatar: {
        width: '100%',
        height: '100%'
    }
}));

const Header: FC<HeaderProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {dataset} = useDataset();

    return (
        <Grid
            className={clsx(classes.root, className)}
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={2}
            {...rest}
        >
            <Grid item>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link variant="body1" color="text.primary" to="/datasets" component={RouterLink}>
                        Datasets
                    </Link>
                    <UserConsumer>
                        {value => (
                            <Box display="flex" alignItems="center">
                                <Box
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        mr: 1.5
                                    }}
                                >
                                    <UserAvatar user={value.user} className={classes.avatar} />
                                </Box>
                                <Link
                                    variant="body1"
                                    color="text.primary"
                                    to={`/users/${value.user.id}`}
                                    component={RouterLink}
                                >
                                    {value.user.name}
                                </Link>
                            </Box>
                        )}
                    </UserConsumer>
                    <Box display="flex">
                        <Typography variant="body1" color="textPrimary">
                            {dataset.name && capitalize(dataset.name)}
                        </Typography>
                        <Chip
                            className={classes.chip}
                            label={dataset.is_public ? 'Public' : 'Private'}
                            icon={dataset.is_public ? <PublicIcon /> : <PrivateIcon />}
                            size="small"
                            variant="filled"
                        />
                    </Box>
                </Breadcrumbs>
            </Grid>

            <Box flexGrow={1} />

            <WorkingAlert className={classes.alert} dataset_id={dataset.id} />
        </Grid>
    );
};

export default Header;
