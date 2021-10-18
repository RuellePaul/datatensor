import type {FC, ReactNode} from 'react';
import React, {useState} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {MDXProvider} from '@mdx-js/react';
import {Container} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NavBar from './NavBar';
import TopBar from './TopBar';
import components from './mdx';


interface DocsLayoutProps {
    children?: ReactNode;
}

const useStyles = makeStyles((theme) => ({
    wrapper: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        paddingTop: 64,
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 256
        }
    },
    contentContainer: {
        flex: '1 1 auto',
        overflow: 'auto'
    },
    content: {
        paddingBottom: 120
    }
}));

const DocsLayout: FC<DocsLayoutProps> = ({ children }) => {
    const classes = useStyles();
    const [isMobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

    return (
        <>
            <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
            <NavBar
                onMobileClose={() => setMobileNavOpen(false)}
                openMobile={isMobileNavOpen}
            />
            <div className={classes.wrapper}>
                <PerfectScrollbar options={{ suppressScrollX: true }}>
                    <div className={classes.contentContainer}>
                        <Container
                            maxWidth="md"
                            className={classes.content}
                        >
                            <MDXProvider components={components}>
                                {children}
                            </MDXProvider>
                        </Container>
                    </div>
                </PerfectScrollbar>
            </div>
        </>
    );
};

DocsLayout.propTypes = {
    children: PropTypes.node
};

export default DocsLayout;
