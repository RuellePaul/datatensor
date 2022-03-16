export default {
    MuiContainer: {
        styleOverrides: {
            root: {
                padding: '0 12px'
            }
        }
    },
    MuiLink: {
        styleOverrides: {
            root: {
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline'
                }
            }
        }
    },
    MuiMasonry: {
        styleOverrides: {
            root: {
                overflow: 'visible'
            }
        }
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                display: 'flex',
                alignItems: 'center',
                fontSize: 18
            }
        }
    },
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                fontSize: 14
            }
        }
    },
    MuiSelect: {
        styleOverrides: {
            select: {
                paddingTop: 12,
                paddingBottom: 12,
            }
        }
    },
    MuiStepButton: {
        styleOverrides: {
            root: {
                '&.Mui-disabled': {
                    opacity: 0.3
                }
            }
        }
    }
};
