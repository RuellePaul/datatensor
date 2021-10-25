import type {FC} from 'react';
import React, {useEffect} from 'react';
import Scrollbar from 'src/components/utils/Scrollbar';
import {Link as RouterLink, useLocation} from 'react-router-dom';
import {Box, Drawer, Hidden, List} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Logo from 'src/components/utils/Logo';
import NavItem from './NavItem';


interface NavBarProps {
    onMobileClose: () => void;
    openMobile: boolean;
}

interface Item {
    title: string;
    href?: string;
    items?: Item[];
}

const items: Item[] = [
    {
        title: 'Welcome',
        items: [
            {
                title: 'Getting started',
                href: '/docs/getting-started'
            },
            {
                title: 'About Datatensor',
                href: '/docs/about-datatensor'
            }
        ]
    },
    {
        title: 'Authentication',
        items: [
            {
                title: 'Register',
                href: '/docs/authentication/register'
            },
            {
                title: 'Account settings',
                href: '/docs/authentication/account-settings'
            }
        ]
    },
    {
        title: 'Dataset workflow',
        items: [
            {
                title: 'Create a dataset',
                href: '/docs/datasets/create-a-dataset'
            },
            {
                title: 'Upload images',
                href: '/docs/datasets/create-a-dataset'
            },
            {
                title: 'Labeling',
                href: '/docs/datasets/labeling'
            },
            {
                title: 'Augmentation',
                href: '/docs/datasets/augmentation'
            },
            {
                title: 'Export',
                href: '/docs/datasets/export'
            }
        ]
    },
    {
        title: 'Computer vision',
        items: [
            {
                title: 'Using an exported dataset',
                href: '/docs/computer-vision/using-an-exported-dataset'
            },
            {
                title: 'API documentation',
                href: '/docs/computer-vision/api-documentation'
            }
        ]
    },
    {
        title: 'Contributing',
        items: [
            {
                title: 'Code hosting',
                href: '/docs/contributing/code-hosting'
            },
            {
                title: 'Running locally',
                href: '/docs/contributing/running-locally'
            },
            {
                title: 'Project architecture',
                href: '/docs/contributing/architecture'
            }
        ]
    }
];

function renderNavItems({ items, depth = 0 }: { items: Item[], depth?: number }) {
    return (
        <List disablePadding sx={{mb: 4}}>
            {items.reduce(
                (acc, item) => reduceChildRoutes({ acc, item, depth }),
                []
            )}
        </List>
    );
}

function reduceChildRoutes({
                               acc,
                               item,
                               depth = 0
                           }: {
    acc: any[];
    item: Item;
    depth: number;
}) {
    if (item.items) {
        acc.push(
            <NavItem
                depth={depth}
                key={item.href}
                title={item.title}
            >
                {renderNavItems({
                    items: item.items,
                    depth: depth + 1
                })}
            </NavItem>
        );
    } else {
        acc.push(
            <NavItem
                depth={depth}
                href={item.href}
                key={item.href}
                title={item.title}
            />
        );
    }

    return acc;
}

const useStyles = makeStyles(() => ({
    mobileDrawer: {
        width: 256
    },
    desktopDrawer: {
        width: 256,
        top: 64,
        height: 'calc(100% - 64px)'
    }
}));

const NavBar: FC<NavBarProps> = ({ onMobileClose, openMobile }) => {
    const classes = useStyles();
    const location = useLocation();

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
            <Scrollbar>
                <Hidden lgUp>
                    <Box p={2}>
                        <RouterLink to="/">
                            <Logo />
                        </RouterLink>
                    </Box>
                </Hidden>
                <Box p={2}>
                    {renderNavItems({ items })}
                </Box>
            </Scrollbar>
        </Box>
    );

    return (
        <>
            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    classes={{ paper: classes.mobileDrawer }}
                    onClose={onMobileClose}
                    open={openMobile}
                    variant="temporary"
                >
                    {content}
                </Drawer>
            </Hidden>
            <Hidden lgDown>
                <Drawer
                    anchor="left"
                    classes={{ paper: classes.desktopDrawer }}
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
