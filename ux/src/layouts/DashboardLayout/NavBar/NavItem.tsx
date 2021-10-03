import React, {FC, ReactNode, useState} from 'react';
import {NavLink as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Button, Collapse, ListItem} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {Theme} from 'src/theme';

interface NavItemProps {
    children?: ReactNode;
    className?: string;
    depth: number;
    href?: string;
    icon?: any;
    info?: any;
    open?: boolean;
    title: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        display: 'block',
        paddingTop: 0,
        paddingBottom: 0
    },
    itemLeaf: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0
    },
    button: {
        color: theme.palette.text.secondary,
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%'
    },
    buttonLeaf: {
        color: theme.palette.text.secondary,
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%',
        fontWeight: theme.typography.fontWeightRegular,
        '&.depth-0': {
            '& $title': {
                fontWeight: theme.typography.fontWeightRegular
            }
        }
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(1)
    },
    title: {
        marginRight: 'auto'
    },
    active: {
        color: theme.palette.primary.main,
        '& $title': {
            fontWeight: `${theme.typography.fontWeightBold} !important`
        },
        '& $icon': {
            color: theme.palette.primary.main
        }
    }
}));

const NavItem: FC<NavItemProps> = ({
    children,
    className,
    depth,
    href,
    icon: Icon,
    info: Info,
    open: openProp,
    title,
    ...rest
}) => {
    const classes = useStyles();
    const [open, setOpen] = useState<boolean>(openProp);

    const handleToggle = (): void => {
        setOpen(prevOpen => !prevOpen);
    };

    let paddingLeft = 8;

    if (depth > 0) {
        paddingLeft = 32 + 8 * depth;
    }

    const style = {paddingLeft};

    if (children) {
        return (
            <ListItem
                className={clsx(classes.item, className)}
                disableGutters
                key={title}
                {...rest}
            >
                <Button
                    className={classes.button}
                    onClick={handleToggle}
                    style={style}
                >
                    {Icon && <Icon className={classes.icon} size="20" />}
                    <span className={classes.title}>{title}</span>
                    {Info && <Info />}
                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
                <Collapse in={open}>{children}</Collapse>
            </ListItem>
        );
    }

    return (
        <ListItem
            className={clsx(classes.itemLeaf, className)}
            disableGutters
            key={title}
            {...rest}
        >
            <Button
                activeClassName={classes.active}
                className={clsx(classes.buttonLeaf, `depth-${depth}`)}
                component={RouterLink}
                style={style}
                to={href}
            >
                {Icon && <Icon className={classes.icon} size="20" />}
                <span className={classes.title}>{title}</span>
                {Info && <Info />}
            </Button>
        </ListItem>
    );
};

NavItem.defaultProps = {
    open: false
};

export default NavItem;
