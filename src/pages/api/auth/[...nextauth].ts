import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import TwitterProvider, { TwitterProfile } from "next-auth/providers/twitter";
import GitHubProvider, { GithubProfile } from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { createHash } from "crypto";

import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

function verifyTelegramAuth(data: any): boolean {
  const secret = createHash("sha256").update(TELEGRAM_BOT_TOKEN).digest();
  const checkHash = data.hash;
  const dataStr = Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");
  const hash = createHash("sha256").update(dataStr).digest("hex");
  return checkHash === hash;
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      connections: {
        [provider: string]: {
          name: string;
          image: string;
        };
      };
      hasLinkedSolana: boolean;
      accessToken: string;
      expirationTime: number;
      refreshToken: string;
      refreshTokenExpirationTime: number;
    };
  }
}
interface CustomJWT extends JWT {
  connections?: {
    [provider: string]: {
      name: string;
      image: string;
    };
  };
  sub?: string;
  hasLinkedSolana?: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Telegram",
      credentials: {
        id: { label: "Telegram ID", type: "text" },
        username: { label: "Telegram Username", type: "text" },
        hash: { label: "Telegram Hash", type: "text" },
      },
      async authorize(credentials) {
        const { id, username, hash } = credentials;

        // Verify the Telegram data
        if (!verifyTelegramAuth({ id, username, hash })) {
          throw new Error("Invalid Telegram authentication");
        }

        // Fetch user data from the backend API
        const user = await fetch(`${process.env.NEST_API_URL}/user/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "telegram",
            providerId: id,
            name: username,
          }),
        }).then((res) => res.json());

        return user || null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      const customToken = token as CustomJWT;

      if (account && profile) {
        if (!customToken.connections) {
          customToken.connections = {};
        }

        // Map provider details based on the provider type
        const providerData: { [provider: string]: any } = {
          discord: {
            id: (profile as DiscordProfile).id,
            name: (profile as DiscordProfile).username,
            avatarUrl: `https://cdn.discordapp.com/avatars/${
              (profile as DiscordProfile).id
            }/${(profile as DiscordProfile).avatar}.png`,
          },
          twitter: {
            id: (profile as TwitterProfile).data?.id,
            name: (profile as TwitterProfile).data?.name,
            avatarUrl: (profile as TwitterProfile).data?.profile_image_url,
          },
          github: {
            id: (profile as GithubProfile).id,
            name: (profile as GithubProfile).login,
            avatarUrl: (profile as GithubProfile).avatar_url,
          },
          telegram: {
            id: account.id,
            name: account.username,
            avatarUrl: "",
          },
        };

        const user = await fetch(`${process.env.NEST_API_URL}/user/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: account.provider,
            providerId: providerData[account.provider].id,
            name: providerData[account.provider].name,
            avatarUrl: providerData[account.provider].avatarUrl,
          }),
        }).then((res) => res.json());

        customToken.sub = user.id;
        customToken.hasLinkedSolana = user.hasLinkedSolana;
        customToken.accessToken = user.token || "";
        customToken.refreshToken = user.refreshToken || "";
        customToken.expirationTime = user.expirationTime || 0;
        customToken.refreshTokenExpirationTime =
          user.refreshTokenExpirationTime || 0;
        customToken.connections = user.connections || {};
      }
      return customToken;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.connections = (token as CustomJWT).connections || {};
      session.user.hasLinkedSolana =
        (token as CustomJWT).hasLinkedSolana || false;
      session.user.accessToken = (token as CustomJWT).accessToken as string;
      session.user.expirationTime = (token as CustomJWT)
        .expirationTime as number;
      session.user.refreshTokenExpirationTime = (token as CustomJWT)
        .refreshTokenExpirationTime as number;
      session.user.refreshToken = (token as CustomJWT).refreshToken as string;
      session.user.hasLinkedSolana = (token as CustomJWT).hasLinkedSolana;

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
