import React, {FC} from 'react';

import {AppBar, IconButton, InputBase, Toolbar} from '@material-ui/core';
import {fade, makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    logo: {
        height: 34
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch'
        }
    }
}));


const Header: FC = () => {
    const classes = useStyles();

    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton
                    edge='start'
                    color='inherit'
                >
                    <img
                        className={classes.logo}
                        src={`${process.env.PUBLIC_URL}/images/datatensor.svg`}
                        alt='Logo'
                        draggable='false'
                    />
                </IconButton>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder='Search…'
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                    />
                </div>
                <div className={classes.grow}/>
                <IconButton
                    edge='end'
                    color='inherit'
                >
                    <AccountCircle
                        fontSize='large'
                    />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
};


interface LayoutProps {
    children: React.ReactNode
}

const Main: FC<LayoutProps> = ({children}: LayoutProps) => {

    return (
        <main>
            <Header/>
            {children}
        </main>
    );
};

export default Main;
