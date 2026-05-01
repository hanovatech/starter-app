import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '$lib/utils/prisma';
import Credentials from '@auth/sveltekit/providers/credentials';
import Postmark from '@auth/sveltekit/providers/postmark';
import bcrypt from 'bcryptjs';
import { AUTH_SECRET, AUTH_POSTMARK_API_TOKEN, AUTH_POSTMARK_SENDER } from '$env/static/private';
import { isDevMode } from '$lib/stores/appModeStore';

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName
        };
      }
    }),
    Postmark({
      apiKey: AUTH_POSTMARK_API_TOKEN,
      from: AUTH_POSTMARK_SENDER,
      normalizeIdentifier(identifier) {
        return identifier.toLowerCase();
      },
      ...(isDevMode()
        ? {
            sendVerificationRequest: async ({ identifier, url }) => {
              console.info('\n========================================');
              console.info(`DEV LOGIN for ${identifier}`);
              console.info(`Click this link to sign in: ${url}`);
              console.info('========================================\n');
            }
          }
        : {})
    })
  ],
  secret: AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-request'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        if (url.includes('/redirect') || url === baseUrl || url === `${baseUrl}/`) {
          return `${baseUrl}/redirect`;
        }
        return url;
      }
      return `${baseUrl}/redirect`;
    },
    async session({ session, token }) {
      const userId = token.id as string;
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        if (user) {
          session.user = {
            ...session.user,
            ...user
          };
        }
      }
      return session;
    }
  }
});
