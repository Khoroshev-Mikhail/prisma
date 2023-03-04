import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from '../../../lib/prisma';
import type { NextAuthOptions } from 'next-auth'
import { DefaultSession } from "next-auth";


declare module "next-auth" {
    interface User {
        accessLevel: number
        id: number | string
    }

    interface Session extends DefaultSession {
        user?: User;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
      accessLevel: number
      id: number | string
    }
}

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
    ],
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.accessLevel = user.accessLevel;
            token.id = user.id
          }
          return token;
        },
        session({ session, token }) {
          if (token && session.user) {
            session.user.accessLevel = token.accessLevel;
            session.user.id = token.id
          }
          return session;
        },
      },
}
export default NextAuth(authOptions)
