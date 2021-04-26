import React, {FC, useState} from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';

import {Close as CloseIcon, Keyboard as KeyboardIcon} from '@material-ui/icons';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

const KeyboardShortcuts: FC = () => {

    const classes = useStyles();

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <>
            <Button
                variant='outlined'
                startIcon={<KeyboardIcon/>}
                onClick={handleOpen}
            >
                Keyboard shortcuts
            </Button>

            <Dialog
                fullWidth
                maxWidth='md'
                open={open}
                onClose={handleClose}
            >
                <DialogTitle disableTypography>
                    <Typography variant='h3'>
                        Shortcuts
                    </Typography>
                    <IconButton
                        className={classes.close}
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item sm={6} xs={12}>
                            <Typography variant='button'>
                                Navigation
                            </Typography>
                            <Divider/>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Typography variant='button'>
                                Labeling
                            </Typography>
                            <Divider/>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    )
};

export default KeyboardShortcuts;