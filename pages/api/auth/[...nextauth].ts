import { DatabaseContextFactory } from "@lib/database/context/databaseContextFactory";
import { CryptoServiceFactory } from "@lib/services/cryptoService";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            id: "0",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req)
            {
                if (!credentials) return null;

                const db = await DatabaseContextFactory.getDefault();
                const user = await db.userGet(credentials.username);

                if (!user || !user.IsActive) return null;

                const passwordToken = await (await CryptoServiceFactory.getDefault()).hashValueDefault(credentials.password);

                if (user.PasswordToken !== passwordToken) return null;

                return {
                    id: user.UserID,
                    isAdmin: user.IsActive,
                    userName: user.UserName,
                }
            }
        })
    ],
    callbacks: {
        async session({ session, user, token })
        {
            if (token) //Sined In
            {
                session.user.isAdmin = token.isAdmin;
                session.user.userName = token.userName;
            }

            return session
        },
        async jwt({ token, user, account, profile, isNewUser })
        {
            if (user) //Sined In
            {
                token.isAdmin = user.isAdmin;
                token.userName = user.userName;
            }
            return token
        }
    }
})