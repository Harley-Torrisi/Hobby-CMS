import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User
    {
        isAdmin: boolean
    }

    interface Session
    {
        user: {
            isAdmin: boolean
        }
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT
    {
        isAdmin: boolean
    }
}