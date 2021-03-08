import React from 'react';
import type { FC } from 'react';

interface LogoProps {
  [key: string]: any;
}

const Logo: FC<LogoProps> = (props) => {
  return (
    <img
      alt="Logo"
      src="/static/logo.svg"
      {...props}
    />
  );
}

export default Logo;
