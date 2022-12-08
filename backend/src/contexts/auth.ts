import jwt from 'jsonwebtoken'
import { ContextFunction } from 'apollo-server-core'

const auth: ContextFunction = async ({ req }) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        return { isAuth: false, userId: '' }
    }
    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'secret')
    } catch (error) {
        return { isAuth: false, userId: '' }
    }
    if (!decodedToken) {
        return { isAuth: false, userId: '' }
    }
    const userId = typeof decodedToken !== 'string' ? decodedToken.id : null
    return { isAuth: true, userId }
}

export default auth
