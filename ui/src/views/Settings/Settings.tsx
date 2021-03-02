import React, {FC} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Appearance, Profile} from './components';

import {Avatar, Box, Button, ButtonGroup, Container, Grid, Typography} from '@material-ui/core';
import {useUser} from 'hooks';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        padding: theme.spacing(4, 0),
        '& > h5, & > p': {
            fontWeight: 600
        }
    },
    avatar: {
        width: 50,
        height: 50
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    button: {
        justifyContent: 'left',

        '& span': {
            textTransform: 'none'
        }
    }
}));


const Menu: FC = () => {

    const classes = useStyles();
    const history = useHistory();

    return (
        <>
            <ButtonGroup
                orientation='vertical'
                color='default'
                variant='outlined'
                fullWidth
                disableElevation
            >
                <Button className={classes.button} onClick={() => history.push('/settings/profile')}>Profile</Button>
                <Button className={classes.button} onClick={() => history.push('/settings/account')}>Account</Button>
                <Button className={classes.button}
                        onClick={() => history.push('/settings/appearance')}>Appearance</Button>
                <Button className={classes.button} onClick={() => history.push('/settings/security')}>Account
                    security</Button>
                <Button className={classes.button} onClick={() => history.push('/settings/billing')}>Billing &
                    plans</Button>
                <Button className={classes.button}
                        onClick={() => history.push('/settings/notifications')}>Notifications</Button>
                <Button className={classes.button} onClick={() => history.push('/settings/developer')}>Developer
                    settings</Button>
            </ButtonGroup>
        </>
    )
};


const Settings: FC = () => {

    const classes = useStyles();
    const {user} = useUser();

    const {parameter} = useParams<{ parameter: string }>();

    return (
        <Container maxWidth='md'>
            <div className={classes.wrapper}>
                <Box display='flex' alignItems='center' m='0 0 1rem'>
                    <Avatar
                        className={classes.avatar}
                        src={user.avatar}
                        alt='User avatar'
                    />
                    <Box ml='1rem'>
                        <Typography
                            className={classes.name}
                            color='textPrimary'
                        >
                            {user.name}
                        </Typography>
                        <Typography
                            color='textSecondary'
                            variant='body2'
                        >
                            Settings
                        </Typography>
                    </Box>
                </Box>

                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        xs={3}
                    >
                        <Menu/>
                    </Grid>

                    <Grid
                        item
                        xs={9}
                    >
                        {parameter === 'profile' && <Profile/>}
                        {parameter === 'appearance' && <Appearance/>}
                    </Grid>
                </Grid>
            </div>
        </Container>
    )
};

export default Settings;