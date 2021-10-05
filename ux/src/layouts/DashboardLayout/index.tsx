import React, {FC, ReactNode, useState} from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import NavBar from './NavBar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
    children?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    wrapper: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        paddingTop: 64,
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 256
        }
    },
    contentContainer: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden'
    },
    content: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto'
    }
}));

const DashboardLayout: FC<DashboardLayoutProps> = ({children}) => {
    const classes = useStyles();
    const [isMobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

    return (
        <div className={classes.root}>
            <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
            <NavBar
                onMobileClose={() => setMobileNavOpen(false)}
                openMobile={isMobileNavOpen}
            />
            <div className={classes.wrapper}>
                <div className={classes.contentContainer}>
                    <div className={classes.content}>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
