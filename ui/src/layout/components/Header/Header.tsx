import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {useUser} from 'hooks';

import {AppBar, Avatar, IconButton, InputBase, Toolbar} from '@material-ui/core';
import {fade, makeStyles} from '@material-ui/core/styles';
import {AccountCircle, Search as SearchIcon} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.background.paper
    },
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
    const history = useHistory();

    const {user} = useUser();

    return (
        <AppBar
            className={classes.root}
            position='sticky'
        >
            <Toolbar>
                <IconButton
                    edge='start'
                    color='inherit'
                    onClick={() => history.push('/')}
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
                {user.id
                    ? <IconButton
                        edge='end'
                        color='inherit'
                    >
                        <Avatar
                            src={user.avatar}
                            alt='User avatar'
                        />
                    </IconButton>
                    : <IconButton
                        edge='end'
                        color='inherit'
                        onClick={() => history.push('/login')}
                    >
                        <AccountCircle fontSize='large'/>
                    </IconButton>
                }
            </Toolbar>
        </AppBar>
    )
};

export default Header;