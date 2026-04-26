import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    phoneVerified?: boolean;
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendTokenExpiry?: number;
  }

  interface Session {
    user: {
      userId: string;
      phoneVerified: boolean;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    phoneVerified: boolean;
    backendAccessToken: string;
    backendRefreshToken: string;
    backendTokenExpiry: number;
    error?: "RefreshAccessTokenError";
  }
}
