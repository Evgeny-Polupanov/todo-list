import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import { ThemeProvider } from '@mui/system'
import { theme } from '../theme'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { SnackbarProvider } from 'notistack'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    useEffect(() => {
        if (router.pathname !== '/login' && !localStorage.getItem('jwt-token')) {
            router.replace('/login')
                .catch((error) => console.error(error))
        }
    }, [router.pathname])

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
