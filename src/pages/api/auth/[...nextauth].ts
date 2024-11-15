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
    CredentialsProvider({
      name: 'Telegram',
      credentials: {
        id: { type: 'text' },
        first_name: { type: 'text' },
        last_name: { type: 'text' },
        username: { type: 'text' },
        photo_url: { type: 'text' },
        hash: { type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        // Verify the Telegram authentication
        const isValid = verifyTelegramAuth(credentials);
        if (!isValid) return null;

        // Return user object
        return {
          id: credentials.id,
          name: `${credentials.first_name} ${credentials.last_name || ''}`.trim(),
          image: credentials.photo_url,
          username: credentials.username,
          provider: 'telegram'
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.connections = token.connections as any;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      if (account) {
        token.connections = {
          ...token.connections,
          [account.provider]: {
            name: user?.name || '',
            image: user?.image || ''
          }
        };
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
};

export default NextAuth(authOptions);
