import React, {FC} from 'react';
import {Container, makeStyles} from '@material-ui/core';
import Page from 'src/components/Page';
import {Theme} from 'src/theme';
import Header from './Header';
import DatasetCreateForm from './DatasetCreateForm';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: 100
    }
}));

const ProductCreateView: FC = () => {
    const classes = useStyles();

    return (
        <Page
            className={classes.root}
            title="Add Dataset"
        >
            <Container component='section' maxWidth="lg">
                <Header/>
                <DatasetCreateForm/>
            </Container>
        </Page>
    );
};

export default ProductCreateView;
