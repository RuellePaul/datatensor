import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Plus as PlusIcon} from 'react-feather';
import {Breadcrumbs, Button, Grid, SvgIcon, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
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
        <Grid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Typography variant="body1" color="textPrimary">
                        Datasets
                    </Typography>
                </Breadcrumbs>
                <Typography variant="h3" color="textPrimary">
                    See the latest datasets
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    color="primary"
                    component={RouterLink}
                    to="/app/datasets/create"
                    variant="contained"
                    startIcon={
                        <SvgIcon fontSize="small">
                            <PlusIcon />
                        </SvgIcon>
                    }
                >
                    New dataset
                </Button>
            </Grid>
        </Grid>
    );
};

export default Header;
