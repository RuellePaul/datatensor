import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Breadcrumbs, capitalize, Chip, Grid, Link, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Lock as PrivateIcon, NavigateNext as NavigateNextIcon, Public as PublicIcon} from '@mui/icons-material';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';

interface HeaderProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    chip: {
        marginLeft: theme.spacing(1)
    }
}));

const Header: FC<HeaderProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {dataset} = useDataset();

    return (
        <Grid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/datasets"
                        component={RouterLink}
                    >
                        Datasets
                    </Link>
                    <Box display="flex">
                        <Typography variant="body1" color="textPrimary">
                            {dataset.name && capitalize(dataset.name)}
                        </Typography>
                        <Chip
                            className={classes.chip}
                            label={dataset.is_public ? 'Public' : 'Private'}
                            icon={
                                dataset.is_public ? (
                                    <PublicIcon />
                                ) : (
                                    <PrivateIcon />
                                )
                            }
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Breadcrumbs>
            </Grid>
        </Grid>
    );
};

export default Header;
