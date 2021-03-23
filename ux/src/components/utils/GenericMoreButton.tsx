import React, {FC, memo, ReactNode, useRef, useState} from 'react';
import {IconButton, makeStyles, Menu, Tooltip} from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(() => ({
    menu: {
        width: 256,
        maxWidth: '100%'
    }
}));

interface GenericMoreButtonProps {
    children?: ReactNode;
}

const GenericMoreButton: FC<GenericMoreButtonProps> = ({children, ...rest}) => {
    const classes = useStyles();
    const moreRef = useRef<any>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const handleMenuOpen = (): void => {
        setOpenMenu(true);
    };

    const handleMenuClose = (): void => {
        setOpenMenu(false);
    };

    return (
        <>
            <Tooltip title="More options">
                <IconButton
                    onClick={handleMenuOpen}
                    ref={moreRef}
                    {...rest}
                >
                    <MoreIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={moreRef.current}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                onClose={handleMenuClose}
                open={openMenu}
                PaperProps={{className: classes.menu}}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
            >
                {children}
            </Menu>
        </>
    );
};

export default memo(GenericMoreButton);
