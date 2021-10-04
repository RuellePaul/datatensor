/* eslint-disable no-use-before-define */
import type {FC} from 'react';
/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import {Link as RouterLink, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
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
    href: string;
    items?: Item[];
}

const items: Item[] = [
    {
        title: 'Getting Started',
        href: '/docs/getting-started'
    },
    {
        title: 'Swagger API',
        href: '/docs/swagger-api'
    }
];

function renderNavItems({ items, depth = 0 }: { items: Item[], depth?: number }) {
    return (
        <List disablePadding>
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
        </Box>
    );

    return <>
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
    </>;
};

NavBar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool
};

export default NavBar;
