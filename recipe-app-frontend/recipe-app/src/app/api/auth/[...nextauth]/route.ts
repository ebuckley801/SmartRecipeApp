import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import prisma from "@/app/lib/prisma";

const handler = NextAuth({
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/',
        signOut: '/'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    },
                })

                if (!user) {
                    throw new Error("No user found");
                }

                const passwordCorrect = await compare(credentials?.password || "", user.password);

                if (passwordCorrect) {
                    return {
                        id: user.id + '',
                        email: user.email,
                        name: user.firstName + ' ' + user.lastName,
                    };
                }
                return null;

            }
        })
    ]
});

export { handler as GET, handler as POST };

