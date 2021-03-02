import React, {useEffect, useState} from 'react';

import Dataset from './Dataset';

import {api} from 'api';
import {Buttons, Form, Inputs} from 'components';
import {useUser} from 'hooks';

import {Drawer, Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4, 6),
        maxWidth: 1550,
        margin: 'auto'
    },
    drawer: {
        '& > .MuiPaper-root': {
            width: 400
        }
    },
    dataset: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        border: `dashed 2px white`
    },
    form: {
        padding: theme.spacing(3, 2)
    },
    button: {
        width: 200,
        float: 'right'
    }
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';


function Overview() {

    const classes = useStyles();

    const {user} = useUser();

    const [open, setOpen] = useState(false);

    const [datasets, setDatasets] = useState([{name: ''}]);
    useEffect(() => {
        api.post('/datasets/management/', {user_id: user.id})
            .then(response => setDatasets(response.data))

    }, [user.id]);

    const toggleDrawer = (anchor: Anchor, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setOpen(open)
    };


    return (
        <div className={classes.root}>
            <Buttons.Default
                className={classes.button}
                label='Add dataset'
                onClick={toggleDrawer('right', true)}
            />
            <Drawer
                anchor='right'
                className={classes.drawer}
                open={open}
                onClose={toggleDrawer('right', false)}
            >
                <Form
                    className={classes.form}
                    schema={{
                        name: {
                            presence: {allowEmpty: false, message: 'Dataset name is required'},
                            length: {
                                minimum: 3,
                                maximum: 20
                            }
                        }
                    }}
                    submit={(formState) => api.post('/datasets/management/create', {
                        user_id: user.id,
                        ...formState!.values
                    })
                        .then(response => setDatasets([...datasets, response.data]))}
                >
                    <Inputs.Text
                        name='name'
                        label='Dataset name'
                    />
                    <Buttons.Default
                        label='Create !'
                        submit
                    />
                </Form>
            </Drawer>

            <Grid container spacing={4}>
                {datasets.map((dataset, index) => (
                    <Grid
                        key={`dataset-${index}`}
                        item
                        lg={3}
                        md={4}
                        sm={6}
                        xs={12}
                    >
                        <Dataset
                            dataset={dataset}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Overview;