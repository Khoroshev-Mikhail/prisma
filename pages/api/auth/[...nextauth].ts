import NextAuth, { Awaitable, RequestInternal, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from '../../../lib/prisma';
const authOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'username',
                    type: 'text',
                    placeholder: 'placeholderkakoito'
                },
                password: {
                    label: 'password',
                    type: 'password'
                },
            },
            authorize: async(credentials, req) => {
                const { username: email, password } = credentials
                const user = await prisma.user.findUnique({
                    where: {
                        email: email ? String(email) : undefined
                    }
                })
                if (user && user.password === password) {
                    return {...user, id: String(user.id)}
                }
                return null
            }
        }),
    ]
}
export default NextAuth(authOptions)
