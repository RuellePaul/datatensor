import React, {FC} from 'react';
import {api} from 'api';
import {Form, Inputs} from 'components';

import {Avatar, Box, Container, Divider, Typography} from '@material-ui/core';
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
    }
}));


const Settings: FC = () => {

    const classes = useStyles();
    const {user} = useUser();

    return (
        <Container maxWidth='md'>
            <div className={classes.wrapper}>
                <Box display='flex' alignItems='center' justifyContent='center' m='0 1rem'>
                    <Avatar
                        className={classes.avatar}
                        src={user.avatar}
                        alt='User avatar'
                    />
                    <Box ml='1rem'>
                        <Typography
                            color='textPrimary'
                            style={{fontWeight: 'bold'}}
                        >
                            {user.name}
                        </Typography>
                        <Typography
                            color='textSecondary'
                            variant='body1'
                        >
                            Account settings
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant='h5'
                    color='textPrimary'
                    gutterBottom
                >
                    Profile
                </Typography>

                <Divider/>

                <Box p='1rem 0'>
                    <Form
                        dynamic
                        schema={{
                            name: {
                                presence: {allowEmpty: false, message: 'Name is required'},
                            }
                        }}
                        submit={formState => api.post('/settings/profile/update_name', formState!.values)
                            .then(response => console.log(response.data))
                        }
                        values={{
                            name: user.name || ''
                        }}
                    >

                        <Typography
                            color='textPrimary'
                        >
                            Name
                        </Typography>

                        <Inputs.Text
                            name='name'
                            size='small'
                        />
                        <Typography
                            variant='caption'
                            color='textSecondary'
                        >
                            Your name may appear around Datatensor on your public datasets.
                        </Typography>
                    </Form>
                </Box>
            </div>
        </Container>
    )
};

export default Settings;