import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Breadcrumbs, Button, Grid, Link, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


interface HeaderProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: FC<HeaderProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <Grid className={clsx(classes.root, className)} container justifyContent="space-between" spacing={3} {...rest}>
            <Grid item>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link variant="body1" color="inherit" to="/app/datasets" component={RouterLink}>
                        Datasets
                    </Link>
                    <Typography variant="body1" color="textPrimary">
                        Create
                    </Typography>
                </Breadcrumbs>
                <Typography variant="h3" color="textPrimary">
                    Create a new dataset
                </Typography>
            </Grid>
            <Grid item>
                <Button component={RouterLink} to="/app/datasets">
                    Cancel
                </Button>
            </Grid>
        </Grid>
    );
};

export default Header;
