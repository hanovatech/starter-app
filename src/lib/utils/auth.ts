import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '$lib/utils/prisma';
import Postmark from '@auth/sveltekit/providers/postmark';
import { AUTH_SECRET, AUTH_POSTMARK_API_TOKEN, AUTH_POSTMARK_SENDER } from '$env/static/private';
import { isDevMode } from '$lib/stores/appModeStore';

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
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
    verifyRequest: '/verify-request'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        if (url.includes('/redirect') || url === baseUrl || url === `${baseUrl}/`) {
          return `${baseUrl}/redirect`;
        }
        return url;
      }
      return `${baseUrl}/redirect`;
    },
    async session({ session }) {
      if (session.user?.id) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id }
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
