import React, {FC, useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Breadcrumbs, Button, Grid, Link, makeStyles, Menu, MenuItem, SvgIcon, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Calendar as CalendarIcon} from 'react-feather';
import {TimeRange} from 'src/types/timeRange'

interface HeaderProps {
    className?: string;
    timeRange: TimeRange;
    setTimeRange: (timeRange: TimeRange) => void;
    timeRanges: TimeRange[];
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: FC<HeaderProps> = ({className, timeRange, setTimeRange, timeRanges, ...rest}) => {
    const classes = useStyles();
    const actionRef = useRef<any>(null);
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

    return (
        <Grid
            container
            spacing={3}
            justify="space-between"
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small"/>}
                    aria-label="breadcrumb"
                >
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app"
                        component={RouterLink}
                    >
                        Reports
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        App dashboard
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Here&apos;s what&apos;s happening
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    ref={actionRef}
                    onClick={() => setMenuOpen(true)}
                    startIcon={
                        <SvgIcon fontSize="small">
                            <CalendarIcon/>
                        </SvgIcon>
                    }
                >
                    {timeRange.text}
                </Button>
                <Menu
                    anchorEl={actionRef.current}
                    onClose={() => setMenuOpen(false)}
                    open={isMenuOpen}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                >
                    {timeRanges.map((_timeRange) => (
                        <MenuItem
                            key={_timeRange.value}
                            onClick={() => setTimeRange(_timeRange)}
                        >
                            {_timeRange.text}
                        </MenuItem>
                    ))}
                </Menu>
            </Grid>
        </Grid>
    );
};

export default Header;
