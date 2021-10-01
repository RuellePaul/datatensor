import React, { FC, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { Close as CloseIcon, Keyboard as KeyboardIcon } from "@mui/icons-material";
import { Theme } from "src/theme";

interface ShortcutProps {
    keyDesc: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    dialog: {
        padding: theme.spacing(1, 2, 2)
    },
    close: {
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
        color: theme.palette.grey[500]
    }
}));

const Section: FC = ({children}) => (
    <Box my={2}>
        <Typography variant="button">{children}</Typography>
    </Box>
);

const Shortcut: FC<ShortcutProps> = ({keyDesc, children}) => (
    <Box my={2}>
        <Grid container spacing={1}>
            <Grid item xs={9}>
                <Typography variant="h5" color="textSecondary">
                    {children}
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="button" color="textPrimary">
                    {keyDesc.toUpperCase()}
                </Typography>
            </Grid>
        </Grid>
    </Box>
);

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
                variant="outlined"
                startIcon={<KeyboardIcon />}
                onClick={handleOpen}
            >
                Keyboard shortcuts
            </Button>

            <Dialog
                disableRestoreFocus
                PaperProps={{
                    className: classes.dialog
                }}
                fullWidth
                maxWidth="lg"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle className="flex">
                    <KeyboardIcon fontSize="large" />

                    <IconButton
                        className={classes.close}
                        onClick={handleClose}
                        size="large"
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box my={2}>
                        <Grid container spacing={4}>
                            <Grid item sm={6} xs={12}>
                                <Section>Labeling</Section>
                                <Divider />
                                <Shortcut keyDesc="a">
                                    Change tool (draw)
                                </Shortcut>
                                <Divider />
                                <Shortcut keyDesc="z">
                                    Change tool (move)
                                </Shortcut>
                                <Divider />
                                <Shortcut keyDesc="CTRL + Z">
                                    Restore previous state
                                </Shortcut>
                                <Divider />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Section>Navigation</Section>
                                <Divider />
                                <Shortcut keyDesc="←">Previous image</Shortcut>
                                <Divider />
                                <Shortcut keyDesc="→">Next image</Shortcut>
                                <Divider />
                                <Shortcut keyDesc="s">Save labels</Shortcut>
                                <Divider />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default KeyboardShortcuts;
