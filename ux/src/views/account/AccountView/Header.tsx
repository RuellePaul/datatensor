import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Breadcrumbs, Link, Typography} from '@mui/material';
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
        <div className={clsx(classes.root, className)} {...rest}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{mb: 1}}>
                <Link color="inherit" to="/datasets" component={RouterLink}>
                    Datasets
                </Link>
                <Typography color="textPrimary">Account</Typography>
            </Breadcrumbs>
            <Typography variant="h3" color="textPrimary">
                Settings
            </Typography>
        </div>
    );
};

export default Header;
