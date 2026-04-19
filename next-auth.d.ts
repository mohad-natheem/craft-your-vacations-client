import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      phoneVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    phoneVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    phoneVerified?: boolean;
  }
}
