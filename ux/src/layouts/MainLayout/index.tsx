import React, {FC, ReactNode} from 'react';
import Scrollbar from 'src/components/utils/Scrollbar';
import makeStyles from '@mui/styles/makeStyles';
import TopBar from './TopBar';


interface MainLayoutProps {
    children?: ReactNode;
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    wrapper: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden'
    }
}));

const MainLayout: FC<MainLayoutProps> = ({children}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TopBar />
            <div className={classes.wrapper}>
                <Scrollbar>{children}</Scrollbar>
            </div>
        </div>
    );
};

export default MainLayout;
