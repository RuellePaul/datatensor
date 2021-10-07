import React, {FC, useRef} from 'react';
import {IconButton, SvgIcon, Tooltip} from '@mui/material';
import useSettings from 'src/hooks/useSettings';
import {THEMES} from 'src/constants';
import {DarkMode, LightMode} from '@mui/icons-material';

const Settings: FC = () => {
    const ref = useRef<any>(null);
    const {settings, saveSettings} = useSettings();

    return (
        <>
            <Tooltip title={settings.theme === THEMES.DARK ? 'Switch to light theme' : 'Switch to dark theme'}>
                <IconButton
                    color="inherit"
                    onClick={() =>
                        saveSettings({
                            ...settings,
                            theme: settings.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
                        })
                    }
                    ref={ref}
                    size="large"
                >
                    <SvgIcon fontSize="small">
                        {settings.theme === THEMES.DARK && <LightMode />}
                        {settings.theme === THEMES.LIGHT && <DarkMode />}
                    </SvgIcon>
                </IconButton>
            </Tooltip>
        </>
    );
};

export default Settings;
