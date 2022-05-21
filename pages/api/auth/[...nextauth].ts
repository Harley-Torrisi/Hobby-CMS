import { ServiceFactory } from "@lib/serviceFactory";
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

                const sec = await ServiceFactory.Security.getDefault();
                const spw = await sec.hashValue(credentials?.password || '', process.env.SECURITY_SALT || '');
                const db = await ServiceFactory.DatabaseFactory.getDefault();
                try
                {
                    const auth = await db.userAuthenticate({ userName: credentials?.username || '', userPasswordToken: spw });
                    return auth != null ? {
                        id: auth?.userName,
                    } : null;
                }
                catch {
                    return null
                }
            }
        })
    ],
})