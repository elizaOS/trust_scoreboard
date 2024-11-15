import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { createHash } from "crypto";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      connections: {
        [provider: string]: {
          name: string;
          image: string;
        };
      };
    } & DefaultSession["user"]
  }
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

interface CustomJWT extends JWT {
  connections?: {
    [provider: string]: {
      name: string;
      image: string;
    };
  };
}

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
        
        const isValid = verifyTelegramAuth(credentials);
        if (!isValid) return null;

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
      return {
        ...session,
        user: {
          ...session.user,
          connections: (token as CustomJWT).connections || {},
          id: token.sub!
        }
      };
    },
    async jwt({ token, user, account }): Promise<CustomJWT> {
      if (user) {
        token.sub = user.id;
      }
      if (account) {
        const customToken = token as CustomJWT;
        customToken.connections = {
          ...(customToken.connections || {}),
          [account.provider]: {
            name: user?.name || '',
            image: user?.image || ''
          }
        };
      }
      return token as CustomJWT;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
};

export default NextAuth(authOptions);
