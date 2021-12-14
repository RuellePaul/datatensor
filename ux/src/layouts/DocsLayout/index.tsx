import type {FC, ReactNode} from 'react';
import React, {useMemo, useState} from 'react';
import {Link as RouterLink, useLocation} from 'react-router-dom';
import {MDXProvider} from '@mdx-js/react';
import Scrollbar from 'src/components/utils/Scrollbar';
import {Box, Button, Container} from '@mui/material';
import {KeyboardArrowLeft as BackIcon, KeyboardArrowRight as NextIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import NavBar, {items} from './NavBar';
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
    },
    buttons: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(4, 0),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            '& > a': {
                width: '100%',
                '&:first-child': {
                    marginBottom: theme.spacing(2)
                }
            }
        }
    }
}));

const DocsButtons: FC = () => {
    const classes = useStyles();
    const { pathname } = useLocation();

    const pages = useMemo(() => items.map(item => item.items).flat(), []);
    const index = pages.map(page => page.href).indexOf(pathname);

    return (
        <div className={classes.buttons}>
            {index > 0 && (
                <Button
                    component={RouterLink}
                    to={pages[index - 1].href}
                    startIcon={<BackIcon />}
                    size="large"
                    variant="contained"
                >
                    {pages[index - 1].title}
                </Button>
            )}

            <Box flexGrow={1} />

            {index < pages.length - 1 && (
                <Button
                    component={RouterLink}
                    to={pages[index + 1].href}
                    endIcon={<NextIcon />}
                    size="large"
                    variant="contained"
                >
                    {pages[index + 1].title}
                </Button>
            )}
        </div>
    );
};

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
                <Scrollbar>
                    <div className={classes.contentContainer}>
                        <Container
                            maxWidth="md"
                            className={classes.content}
                        >
                            <MDXProvider components={components}>
                                {children}
                            </MDXProvider>

                            <DocsButtons />
                        </Container>
                    </div>
                </Scrollbar>
            </div>
        </>
    );
};

export default DocsLayout;
