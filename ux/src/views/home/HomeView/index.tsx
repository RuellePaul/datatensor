import React, {FC} from 'react';
import {makeStyles} from '@mui/styles';
import Page from 'src/components/Page';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import CTA from './CTA';
import FAQS from './FAQS';

const useStyles = makeStyles(() => ({
    root: {}
}));

const HomeView: FC = () => {
    const classes = useStyles();

    return (
        <Page className={classes.root}>
            <Hero />
            <Features />
            <Testimonials />
            <CTA />
            <FAQS />
        </Page>
    );
};

export default HomeView;
