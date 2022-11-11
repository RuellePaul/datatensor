import type {FC} from 'react';
import React from 'react';
import Logo from 'src/components/utils/Logo';
import {keyframes} from '@emotion/react';


const bounce1 = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 1px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const bounce3 = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 3px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const AnimatedLogo: FC = () => (
    <Logo
        sx={{
            height: 80,
            width: 80,
            '& path:nth-child(1)': {
                animation: `${bounce1} 1s ease-in-out infinite`
            },
            '& path:nth-child(3)': {
                animation: `${bounce3} 1s ease-in-out infinite`
            }
        }}
    />
);

export default AnimatedLogo;