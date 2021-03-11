import React, {FC} from 'react';
import {makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const CustomerEditView: FC = () => {
    const classes = useStyles();

    return (
        <Page
            className={classes.root}
            title="User Details"
        >
            ...
        </Page>
    );
};

export default CustomerEditView;
