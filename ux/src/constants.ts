export const ENABLE_REDUX_DEV_TOOLS = process.env.REACT_APP_ENVIRONMENT === 'development';

export const LAZY_LOAD_BATCH = 15;

export const HEARTBEAT_DELAY = 4000; // in ms

export const THEMES = {
    LIGHT: 'LIGHT',
    DARK: 'DARK'
};

export const EMPTY_DESCRIPTIONS = [
    undefined,
    null,
    '',
    '<p></p>',
    '<p> </p>',
    '<p>  </p>',
    '<p><br/></p>',
]