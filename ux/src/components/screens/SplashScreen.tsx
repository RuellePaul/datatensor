import React from 'react';
import type {FC} from 'react';
import {Box} from '@mui/material';
import AnimatedLogo from 'src/components/utils/AnimatedLogo';

const SplashScreen: FC = () => (
    <Box
        sx={{
            alignItems: 'center',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            justifyContent: 'center',
            left: 0,
            p: 3,
            position: 'fixed',
            top: 0,
            width: '100vw',
            zIndex: 2000
        }}
    >
        <AnimatedLogo/>
    </Box>
);

export default SplashScreen;