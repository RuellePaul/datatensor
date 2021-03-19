/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, {FC, ReactNode, useEffect} from 'react';
import {Link as RouterLink, matchPath, useLocation} from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Box, Chip, Divider, Drawer, Hidden, Link, List, ListSubheader, makeStyles, Typography} from '@material-ui/core';
import {
    Activity as ActivityIcon,
    Database as DatabaseIcon,
    Folder as FolderIcon,
    Package as PackageIcon,
    PieChart as PieChartIcon,
    Users as UsersIcon
} from 'react-feather';
import Logo from 'src/components/Logo';
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
    {
        subheader: 'Reports',
        items: [
            ...(user.is_admin ? [{
                title: 'App dashboard',
                icon: PieChartIcon,
                href: '/app/admin/reports/dashboard',
                info: () => (
                    <Chip
                        size="small"
                        label="Admin"
                        variant="outlined"
                    />
                )
            }] : []),
            {
                title: 'Dashboard',
                icon: ActivityIcon,
                href: '/app/reports/dashboard'
            }
        ]
    },
    {
        subheader: 'Management',
        items: [
            ...(user.is_admin ? [{
                title: 'Users',
                icon: UsersIcon,
                href: '/app/admin/manage/users',
                info: () => (
                    <Chip
                        size="small"
                        label="Admin"
                        variant="outlined"
                    />
                ),
                items: [
                    {
                        title: 'List Users',
                        href: '/app/admin/manage/users'
                    },
                    {
                        title: 'View User',
                        href: `/app/admin/manage/users/${user.id}/details`  // FIXME (match)
                    }
                ]
            }] : []),
            {
                title: 'Datasets',
                icon: PackageIcon,
                href: '/app/manage/datasets',
                items: [
                    {
                        title: 'Create a dataset',
                        href: '/app/manage/datasets/create'
                    },
                    {
                        title: 'Browse datasets',
                        href: '/app/manage/datasets'
                    },
                ]
            },
            {
                title: 'Training data',
                icon: DatabaseIcon,
                href: '/admin/manage/datasets',
                items: [
                    {
                        title: 'Upload',
                        href: '/404'
                    },
                    {
                        title: 'Video to images',
                        href: '/404'
                    },
                    {
                        title: 'From the web',
                        href: '/404'
                    },
                    {
                        title: 'Augmentation',
                        href: '/404'
                    }
                ]
            },
            {
                title: 'Models',
                icon: FolderIcon,
                href: '/admin/manage/orders',
                items: [
                    {
                        title: 'Train a model',
                        href: '/404'
                    },
                    {
                        title: 'Compute mAP',
                        href: '/404'
                    },
                    {
                        title: 'Real time inference',
                        href: '/404'
                    }
                ]
            }
        ]
    }
];

function renderNavItems({
                            items,
                            pathname,
                            depth = 0
                        }: {
    items: Item[];
    pathname: string;
    depth?: number;
}) {
    return (
        <List disablePadding>
            {items.reduce(
                (acc, item) => reduceChildRoutes({acc, item, pathname, depth}),
                []
            )}
        </List>
    );
}

function reduceChildRoutes({
                               acc,
                               pathname,
                               item,
                               depth
                           }: {
    acc: any[];
    pathname: string;
    item: Item;
    depth: number;
}) {
    const key = item.title + depth;

    if (item.items) {
        const open = matchPath(pathname, {
            path: item.href,
            exact: false
        });

        acc.push(
            <NavItem
                depth={depth}
                icon={item.icon}
                info={item.info}
                key={key}
                open={Boolean(open)}
                title={item.title}
            >
                {renderNavItems({
                    depth: depth + 1,
                    pathname,
                    items: item.items
                })}
            </NavItem>
        );
    } else {
        acc.push(
            <NavItem
                depth={depth}
                href={item.href}
                icon={item.icon}
                info={item.info}
                key={key}
                title={item.title}
            />
        );
    }

    return acc;
}

const useStyles = makeStyles(theme => ({
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
        height: 64,
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
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <PerfectScrollbar options={{suppressScrollX: true}}>
                <Hidden lgUp>
                    <Box
                        p={2}
                        display="flex"
                        justifyContent="center"
                    >
                        <RouterLink to="/">
                            <Logo/>
                        </RouterLink>
                    </Box>
                </Hidden>
                <Box p={2}>
                    <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <RouterLink to="/app/account">
                            <UserAvatar
                                className={classes.avatar}
                                user={user}
                            />
                        </RouterLink>
                    </Box>
                    <Box
                        mt={2}
                        textAlign="center"
                    >
                        <Link
                            component={RouterLink}
                            to="/app/account"
                            variant="h5"
                            color="textPrimary"
                            underline="none"
                        >
                            {user.name}
                        </Link>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            Your tier:
                            {' '}
                            <Link
                                component={RouterLink}
                                to="/pricing"
                            >
                                {user.tier}
                            </Link>
                        </Typography>
                    </Box>
                </Box>
                <Divider/>
                <Box p={2}>
                    {sections(user).map((section) => (
                        <List
                            key={section.subheader}
                            className={classes.list}
                            subheader={(
                                <ListSubheader
                                    disableGutters
                                    disableSticky
                                >
                                    {section.subheader}
                                </ListSubheader>
                            )}
                        >
                            {renderNavItems({
                                items: section.items,
                                pathname: location.pathname
                            })}
                        </List>
                    ))}
                </Box>
                <Divider/>
                <Box p={2}>
                    <Box
                        p={2}
                        borderRadius="borderRadius"
                        bgcolor="background.dark"
                    >
                        <Typography
                            variant="h6"
                            color="textPrimary"
                        >
                            Need Help?
                        </Typography>
                    </Box>
                </Box>
            </PerfectScrollbar>
        </Box>
    );

    return (
        <>
            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    classes={{paper: classes.mobileDrawer}}
                    onClose={onMobileClose}
                    open={openMobile}
                    variant="temporary"
                >
                    {content}
                </Drawer>
            </Hidden>
            <Hidden mdDown>
                <Drawer
                    anchor="left"
                    classes={{paper: classes.desktopDrawer}}
                    open
                    variant="persistent"
                >
                    {content}
                </Drawer>
            </Hidden>
        </>
    );
};

export default NavBar;
