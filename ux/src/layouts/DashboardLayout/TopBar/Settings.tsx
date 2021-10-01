import React, {FC, useRef, useState} from 'react';
import {capitalCase} from 'change-case';
import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    Divider,
    Drawer,
    IconButton,
    makeStyles,
    SvgIcon,
    Tooltip,
    Typography
} from '@material-ui/core';
import {Settings as SettingsIcon} from 'react-feather';
import useSettings from 'src/hooks/useSettings';
import {THEMES} from 'src/constants';
import {Theme} from 'src/theme';
import {Close as CloseIcon} from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
    badge: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 5
    },
    drawer: {
        width: 360
    }
}));

const Settings: FC = () => {
    const classes = useStyles();
    const ref = useRef<any>(null);
    const {settings, saveSettings} = useSettings();
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Settings">
                <Badge
                    color="secondary"
                    variant="dot"
                    classes={{badge: classes.badge}}
                >
                    <IconButton
                        color="inherit"
                        onClick={handleOpen}
                        ref={ref}
                    >
                        <SvgIcon fontSize="small">
                            <SettingsIcon/>
                        </SvgIcon>
                    </IconButton>
                </Badge>
            </Tooltip>
            <Drawer
                anchor="right"
                classes={{paper: classes.drawer}}
                onClose={handleClose}
                open={isOpen}
                variant="temporary"
            >
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    p={2}
                >
                    <Typography
                        variant="h4"
                        color="textPrimary"
                    >
                        Settings
                    </Typography>

                    <IconButton
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Box>

                <Divider/>

                <Box
                    p={2}
                >
                    <Typography
                        variant='body1'
                        color='textPrimary'
                        gutterBottom
                    >
                        Theme
                    </Typography>
                    <ButtonGroup
                        color='primary'
                        fullWidth
                        variant="outlined"
                    >
                        {Object.keys(THEMES).map((theme) => (
                            <Button
                                key={`theme-${theme}`}
                                onClick={() => saveSettings({...settings, theme})}
                                variant={settings.theme === theme ? 'contained' : 'outlined'}
                            >
                                {capitalCase(theme)}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Box>
            </Drawer>
        </>
    );
};

export default Settings;
