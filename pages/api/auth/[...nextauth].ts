import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from '../../../lib/prisma';
import type { NextAuthOptions } from 'next-auth'
export const authOptions: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            name: 'Login & Password',
            credentials: {
                username: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'email@crcc.ru'
                },
                password: {
                    label: 'Password',
                    type: 'Password'
                },
            },
            authorize: async(credentials, req) => {
                const { username: email, password } = credentials
                if(!email || !password){
                    return null
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: String(email)
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
