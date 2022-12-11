import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import { ThemeProvider } from '@mui/system'
import { theme } from '../theme'
import { SnackbarProvider } from 'notistack'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <Component {...pageProps} />
                </SnackbarProvider>
            </ThemeProvider>
        </ApolloProvider>
    )
}
