import React, {useState} from 'react';

import {api} from 'api';
import {Buttons, Form, Inputs} from 'components';

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
    }
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';


function Overview() {

    const classes = useStyles();

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
            submit={(formState) => api.post('/datasets/management/create', formState!.values)
                .then(response => console.log(response.data))}
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
                        label='Dataset name'
                        onClick={toggleDrawer(anchor, true)}
                    />
                    <Drawer anchor={anchor} className={classes.drawer} open={state[anchor]}
                            onClose={toggleDrawer(anchor, false)}>
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}

export default Overview;