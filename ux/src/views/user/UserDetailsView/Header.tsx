import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { Breadcrumbs, Grid, Link, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

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
            container
            spacing={3}
            justifyContent="space-between"
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
                        to="/app"
                        component={RouterLink}
                    >
                        Dashboard
                    </Link>
                    <Typography variant="body1" color="textPrimary">
                        Users
                    </Typography>
                </Breadcrumbs>
            </Grid>
        </Grid>
    );
};

export default Header;
