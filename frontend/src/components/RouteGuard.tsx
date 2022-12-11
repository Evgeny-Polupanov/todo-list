import { useRouter } from 'next/router'
import { FC, ReactElement, useEffect, useState } from 'react'

interface Props {
    children: ReactElement | null;
}

const RouteGuard: FC<Props> = ({ children }) => {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        authCheck()

        const hideContent = () => setIsAuthorized(false)
        router.events.on('routeChangeStart', hideContent)
        router.events.on('routeChangeComplete', authCheck)

        return () => {
            router.events.off('routeChangeStart', hideContent)
            router.events.off('routeChangeComplete', authCheck)
        }
    }, [])

    const authCheck = () => {
        if (router.pathname === '/login') {
            return setIsAuthorized(true)
        }
        const authToken = localStorage.getItem('jwt-token')
        if (!authToken) {
            setIsAuthorized(false)
            return router.replace('/login')
        }
        return setIsAuthorized(true)
    }

    return (isAuthorized ? children : null)
}

export default RouteGuard
