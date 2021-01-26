import React, {FC} from 'react';
import {api} from 'api';
import {Form, Inputs, Structure} from 'components';

import {Box} from '@material-ui/core';

const Settings: FC = () => {

    return (
        <Structure.Center
            title='Settings'
        >
            <Form
                dynamic
                schema={{
                    name: {
                        presence: {allowEmpty: false, message: 'Username is required'},
                    }
                }}
                submit={formState => api.post('/settings/profile/update_name', formState!.values)
                    .then(response => console.log(response.data))
                }
            >
                <Box p='1rem'>
                    <Inputs.Text
                        name='name'
                        label='Username'
                    />
                </Box>
            </Form>
        </Structure.Center>
    )
};

export default Settings;