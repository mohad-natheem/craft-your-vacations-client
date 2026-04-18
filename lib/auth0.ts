import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    connection: "google-oauth2",
    scope: "openid profile email",
  },
});
