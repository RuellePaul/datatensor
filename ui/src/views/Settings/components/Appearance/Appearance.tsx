import React, {FC} from 'react';

import {api} from 'api';
import {Form, Inputs} from 'components';
import config from 'config';
import {useUser} from 'hooks';

import {Box, Divider, Typography} from '@material-ui/core';


const Appearance: FC = () => {

    const {user, setUser} = useUser();

    return (
        <>
            <Typography
                variant='h5'
                color='textPrimary'
                gutterBottom
            >
                Appearance
            </Typography>

            <Divider/>

            <Box p='1rem 0'>
                <Form
                    dynamic
                    schema={{
                        theme: {
                            presence: {allowEmpty: false, message: 'Theme is required'},
                        }
                    }}
                    submit={formState => api.post('/settings/appearance/update_theme', {
                        user_id: user.id,
                        ...formState!.values
                    })
                        .then(response => setUser({
                            ...user,
                            theme: response.data
                        }))
                    }
                    values={{
                        theme: user.theme || config.DEFAULT_THEME
                    }}
                >

                    <Typography
                        color='textPrimary'
                    >
                        Use the light or dark theme to choose how Datatensor looks to you.
                    </Typography>

                    <Inputs.Select
                        name='theme'
                        options={[
                            {
                                label: 'Light',
                                value: 'light'
                            },
                            {
                                label: 'Dark',
                                value: 'dark'
                            }
                        ]}
                        helper='The theme is stored automatically'
                    />
                </Form>
            </Box>
        </>
    )
};

export default Appearance;