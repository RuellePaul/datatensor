import React, {FC} from 'react';

import {api} from 'api';
import {Form, Inputs} from 'components';
import {useUser} from 'hooks';

import {Box, Divider, Typography} from '@material-ui/core';


const Profile: FC = () => {

    const {user} = useUser();

    return (
        <>
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
                        color='textSecondary'
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
        </>
    )
};

export default Profile;