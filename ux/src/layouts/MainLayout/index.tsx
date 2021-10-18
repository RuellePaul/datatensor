import React, {FC, ReactNode} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import makeStyles from '@mui/styles/makeStyles';
import TopBar from './TopBar';


interface MainLayoutProps {
    children?: ReactNode;
}

const useStyles = makeStyles(theme => ({
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
        paddingTop: 64
    }
}));

const MainLayout: FC<MainLayoutProps> = ({children}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TopBar />
            <div className={classes.wrapper}>
                <PerfectScrollbar options={{suppressScrollX: true}}>{children}</PerfectScrollbar>
            </div>
        </div>
    );
};

export default MainLayout;
