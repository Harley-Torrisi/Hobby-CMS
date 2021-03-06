// Removed until addition preopeties acually needed

import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User
    {
        isAdmin: boolean
        userName: string
    }

    interface Session
    {
        user: {
            isAdmin: boolean
            userName: string
        }
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT
    {
        isAdmin: boolean
        userName: string
    }
}