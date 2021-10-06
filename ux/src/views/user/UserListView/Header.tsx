import React, {FC} from 'react';
import clsx from 'clsx';
import {Breadcrumbs, Grid, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Theme} from 'src/theme';


interface HeaderProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    }
}));

const Header: FC<HeaderProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <Grid className={clsx(classes.root, className)} container spacing={3} {...rest}>
            <Grid item>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Typography variant="body1" color="textPrimary">
                        Users
                    </Typography>
                </Breadcrumbs>
                <Typography variant="h3" color="textPrimary">
                    All Users
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Header;
