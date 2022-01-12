/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, {FC, ReactNode, useEffect} from 'react';
import {Link as RouterLink, matchPath, useLocation} from 'react-router-dom';
import Scrollbar from 'src/components/utils/Scrollbar';
import {Box, Chip, Divider, Drawer, Hidden, Link, List, ListSubheader, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {DeveloperBoard as AdminDashboardIcon} from '@mui/icons-material';
import {Package as DatasetIcon, Users as UsersIcon} from 'react-feather';
import Logo from 'src/components/utils/Logo';
import UserAvatar from 'src/components/UserAvatar';
import useAuth from 'src/hooks/useAuth';
import NavItem from './NavItem';
import {User} from 'src/types/user';

interface NavBarProps {
    openMobile: boolean;
    onMobileClose: () => void;
}

interface Item {
    href?: string;
    icon?: ReactNode;
    info?: ReactNode;
    items?: Item[];
    title: string;
}

interface Section {
    items: Item[];
    subheader: string;
}

const sections = (user: User): Section[] => [
    ...(user.is_admin
        ? [
              {
                  subheader: 'Reports',
                  items: [
                      {
                          title: 'App dashboard',
                          icon: AdminDashboardIcon,
                          href: '/admin/dashboard',
                          info: () => <Chip size="small" label="Admin" variant="outlined" />
                      }
                  ]
              }
          ]
        : []
    ),
    {
        subheader: 'Application',
        items: [
            ...(user.is_admin
                ? [
                      {
                          title: 'Users',
                          icon: UsersIcon,
                          href: '/users',
                          info: () => <Chip size="small" label="Admin" variant="outlined" />
                      }
                  ]
                : []),
            {
                title: 'Datasets',
                icon: DatasetIcon,
                href: '/datasets'
            }
        ]
    }
];

function renderNavItems({items, pathname, depth = 0}: {items: Item[]; pathname: string; depth?: number}) {
    return (
        <List disablePadding>{items.reduce((acc, item) => reduceChildRoutes({acc, item, pathname, depth}), [])}</List>
    );
}

function reduceChildRoutes({acc, pathname, item, depth}: {acc: any[]; pathname: string; item: Item; depth: number}) {
    const key = item.title + depth;

    if (item.items) {
        const open = matchPath(pathname, {
            path: item.href,
            exact: false
        });

        acc.push(
            <NavItem depth={depth} icon={item.icon} info={item.info} key={key} open={Boolean(open)} title={item.title}>
                {renderNavItems({
                    depth: depth + 1,
                    pathname,
                    items: item.items
                })}
            </NavItem>
        );
    } else {
        acc.push(
            <NavItem depth={depth} href={item.href} icon={item.icon} info={item.info} key={key} title={item.title} />
        );
    }

    return acc;
}

const useStyles = makeStyles(theme => ({
    drawer: {
        zIndex: 1400
    },
    mobileDrawer: {
        width: 256
    },
    desktopDrawer: {
        width: 256,
        top: 64,
        height: 'calc(100% - 64px)'
    },
    avatar: {
        cursor: 'pointer',
        width: 64,
        height: 64
    },
    list: {
        '& .MuiChip-outlined': {
            color: theme.palette.warning.main,
            border: `solid 1px ${theme.palette.warning.main}`
        }
    }
}));

const NavBar: FC<NavBarProps> = ({onMobileClose, openMobile}) => {
    const classes = useStyles();
    const location = useLocation();
    const {user} = useAuth();

    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const content = (
        <Box height="100%" display="flex" flexDirection="column">
            <Scrollbar>
                <Hidden lgUp>
                    <Box p={2} display="flex" justifyContent="center">
                        <RouterLink to="/">
                            <Logo />
                        </RouterLink>
                    </Box>
                </Hidden>
                <Box p={2}>
                    <Box display="flex" justifyContent="center">
                        <RouterLink to="/account">
                            <UserAvatar className={classes.avatar} />
                        </RouterLink>
                    </Box>
                    <Box mt={2} textAlign="center">
                        <Link
                            component={RouterLink}
                            to="/account"
                            variant="h5"
                            color="textPrimary"
                            underline="none"
                        >
                            {user.name}
                        </Link>
                    </Box>
                </Box>
                <Divider />
                <Box p={2}>
                    {sections(user).map(section => (
                        <List
                            key={section.subheader}
                            className={classes.list}
                            subheader={
                                <ListSubheader disableGutters disableSticky>
                                    {section.subheader}
                                </ListSubheader>
                            }
                        >
                            {renderNavItems({
                                items: section.items,
                                pathname: location.pathname
                            })}
                        </List>
                    ))}
                </Box>
                <Divider />
                <Box p={2}>
                    <Box p={2} borderRadius={1} bgcolor="background.default">
                        <Typography variant="h6" color="textPrimary">
                            Need Help?
                        </Typography>
                        <Link variant="subtitle1" color="primary" component={RouterLink} to="/docs">
                            Check our docs
                        </Link>
                    </Box>
                </Box>
            </Scrollbar>
        </Box>
    );

    return (
        <>
            <Hidden lgUp>
                <Drawer
                    className={classes.drawer}
                    anchor="left"
                    classes={{paper: classes.mobileDrawer}}
                    onClose={onMobileClose}
                    open={openMobile}
                    variant="temporary"
                >
                    {content}
                </Drawer>
            </Hidden>
            <Hidden lgDown>
                <Drawer anchor="left" classes={{paper: classes.desktopDrawer}} open variant="persistent">
                    {content}
                </Drawer>
            </Hidden>
        </>
    );
};

export default NavBar;
