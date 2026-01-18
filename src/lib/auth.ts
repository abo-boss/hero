import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const FALLBACK_EMAIL = "cxbyy129@126.com"
const FALLBACK_PASSWORD = "cxb63607"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (user) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isPasswordValid) {
              return null
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            }
          }
        } catch (e) {
          // Ignore DB errors and fall back to hardcoded admin
        }

        if (
          credentials.email === FALLBACK_EMAIL &&
          credentials.password === FALLBACK_PASSWORD
        ) {
          return {
            id: "admin-fallback",
            email: FALLBACK_EMAIL,
            name: "Admin",
            image: null,
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        const user = session.user as any
        user.id = token.sub as string
        user.image = token.picture as string
        user.name = token.name as string
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id
        token.picture = user.image
        token.name = user.name
      }
      
      // Handle session update
      if (trigger === "update" && session?.user) {
        if (session.user.image) token.picture = session.user.image
        if (session.user.name) token.name = session.user.name
      }
      
      return token
    }
  }
}
