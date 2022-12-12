import { createTheme } from '@mui/material'

export const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: 16,
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    margin: 'auto',
                },
            },
        },
    },
})
