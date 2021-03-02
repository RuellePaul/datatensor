import React, {useEffect, useState} from 'react';

import {api} from 'api';
import {Buttons, Form, Inputs} from 'components';
import {useUser} from 'hooks';

import {Drawer} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4, 6)
    },
    drawer: {
        '& > .MuiPaper-root': {
            width: 400
        }
    },
    dataset: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        border: 'dashed 2px red'
    }
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';


function Overview() {

    const classes = useStyles();

    const {user} = useUser();

    const [datasets, setDatasets] = useState([{name: ''}]);
    useEffect(() => {
        api.post('/datasets/management/', {user_id: user.id})
            .then(response => setDatasets(response.data))

    }, [user.id]);

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false
    });

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

        setState({...state, [anchor]: open});
    };

    const list = (anchor: Anchor) => (
        <Form
            schema={{
                name: {
                    presence: {allowEmpty: false, message: 'Name is required'},
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
    );

    return (
        <div className={classes.root}>
            {(['right'] as Anchor[]).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Buttons.Default
                        label='Add dataset'
                        onClick={toggleDrawer(anchor, true)}
                    />
                    <Drawer anchor={anchor} className={classes.drawer} open={state[anchor]}
                            onClose={toggleDrawer(anchor, false)}>
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}

            {datasets.map((dataset, index) => <div className={classes.dataset}>
                Dataset {index} : {dataset.name}
            </div>)}
        </div>
    );
}

export default Overview;