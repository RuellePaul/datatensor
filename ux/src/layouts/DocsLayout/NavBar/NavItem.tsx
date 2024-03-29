import type {FC, ReactNode} from 'react';
import React from 'react';
import {NavLink as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {Button, ListItem, Typography} from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';


interface NavItemProps {
    children?: ReactNode;
    className?: string;
    depth: number;
    href?: string;
    title: string;
}

const useStyles = makeStyles((theme) => ({
    item: {
        display: 'block',
        paddingTop: 0,
        paddingBottom: 0
    },
    itemLeaf: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0,
        color: theme.palette.text.secondary
    },
    button: {
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%'
    },
    title: {
        marginRight: 'auto'
    },
    buttonLeaf: {
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%',
        fontWeight: theme.typography.fontWeightRegular,
        '&.depth-0': {
            fontWeight: theme.typography.fontWeightRegular
        }
    },
    active: {
        color: theme.palette.primary.main,
        '& $title': {
            fontWeight: `${theme.typography.fontWeightBold} !important`
        }
    }
}));

const NavItem: FC<NavItemProps> = ({
                                       children,
                                       className,
                                       depth,
                                       href,
                                       title,
                                       ...rest
                                   }) => {
    const classes = useStyles();
    let paddingLeft = 8;

    if (depth > 0) {
        paddingLeft = 32 + 8 * depth;
    }

    const style = { paddingLeft };

    if (children) {
        return (
            <ListItem
                className={clsx(classes.item, className)}
                disableGutters
                {...rest}
            >
                {depth === undefined
                    ? (
                        <Button
                            className={classes.button}
                            color="inherit"
                            style={style}
                        >
                            <span className={classes.title}>{title}</span>
                        </Button>
                    )
                    : (
                        <Typography
                            color="textPrimary"
                            style={style}
                            variant="overline"
                        >
                            {title}
                        </Typography>
                    )
                }

                {children}
            </ListItem>
        );
    }

    return (
        <ListItem
            className={clsx(classes.itemLeaf, className)}
            disableGutters
            {...rest}
        >
            <Button
                activeClassName={classes.active}
                className={clsx(classes.buttonLeaf, `depth-${depth}`)}
                component={RouterLink}
                color="inherit"
                exact
                style={style}
                to={href}
            >
                <span className={classes.title}>{title}</span>
            </Button>
        </ListItem>
    );
};

NavItem.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    depth: PropTypes.number.isRequired,
    href: PropTypes.string,
    title: PropTypes.string.isRequired
};

export default NavItem;
