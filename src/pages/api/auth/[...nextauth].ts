import NextAuth, { NextAuthOptions } from 'next-auth';
import { DefaultSession } from 'next-auth';
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord';
import GitHubProvider, { GithubProfile } from 'next-auth/providers/github';
import TwitterProvider, { TwitterProfile } from 'next-auth/providers/twitter';
import { JWT } from 'next-auth/jwt';
import { Account, Profile, User } from 'next-auth';

// Declare module to augment next-auth types
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id?: string;
      connections?: {
        [provider: string]: {
          name: string;
          image: string;
        };
      };
    };
  }
}

// Extend JWT interface to include connections
interface CustomJWT extends JWT {
  connections?: {
    [provider: string]: {
      name: string;
      image: string;
    };
  };
  sub?: string;
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
      version: '2.0',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      const customToken = token as CustomJWT;

      if (account && profile) {
        if (!customToken.connections) {
          customToken.connections = {};
        }

        switch (account.provider) {
          case 'discord':
            const discordProfile = profile as DiscordProfile;
            customToken.connections.discord = {
              name: discordProfile.username || discordProfile.name || '',
              image: `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`,
            };
            break;
          case 'twitter':
            const twitterProfile = profile as TwitterProfile;
            customToken.connections.twitter = {
              name: twitterProfile.data?.name || twitterProfile.data?.username || '',
              image: twitterProfile.data?.profile_image_url || '',
            };
            break;
          case 'github':
            const githubProfile = profile as GithubProfile;
            customToken.connections.github = {
              name: githubProfile.login || githubProfile.name || '',
              image: githubProfile.avatar_url || '',
            };
            break;
        }
      }
      return customToken;
    },
    async session({ session, token }) {
      const customToken = token as CustomJWT;

      if (customToken.connections) {
        session.user.connections = customToken.connections;
      }

      // Ensure user.id is set from the token's sub
      if (customToken.sub) {
        session.user.id = customToken.sub;
      }

      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);