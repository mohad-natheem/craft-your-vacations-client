import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const BACKEND_URL = "http://localhost:5025";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let res: Response;
        try {
          res = await fetch(`${BACKEND_URL}/api/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Username: credentials.email,
              Password: credentials.password,
            }),
          });
        } catch (err) {
          console.error("[authorize] fetch threw:", err);
          return null;
        }

        if (!res.ok) {
          const error = await res.json();
          return null;
        }

        const user = await res.json();
        console.log("Backend Response", user);
        return {
          id: String(user.userId),
          email: credentials.email,
          name: user.name ?? null,
          image: user.image ?? null,
          phoneVerified: user.phoneVerified ?? false,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${BACKEND_URL}/api/Auth/google-signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Name: user.name,
              Email: user.email,
              MobileNumber: null,
              Image: user.image,
            }),
          });
          if (!res.ok) {
            console.error(
              "[signIn] /google-signin failed:",
              res.status,
              await res.text(),
            );
            return false;
          }
          const backendUser = await res.json();
          console.log("Backend User", backendUser);
          user.id = String(backendUser.userId);
          (user as { phoneVerified?: boolean }).phoneVerified =
            backendUser.phoneVerified ?? false;
        } catch (err) {
          console.error("[signIn] fetch threw:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Allow client-side session update (e.g. after OTP verification)
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      if (user) {
        console.log("Before Token User Id", user.id);
        token.userId = user.id;
        token.phoneVerified =
          (user as { phoneVerified?: boolean }).phoneVerified ?? false;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("Token User Id", token.userId);

      session.user.userId = token.userId as string;
      session.user.phoneVerified = (token.phoneVerified as boolean) ?? false;
      console.log("Session  User Id", session.user.userId);
      return session;
    },
  },
};
