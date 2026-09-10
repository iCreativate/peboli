import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';
import { hashPassword, verifyPassword } from '@/lib/password';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@peboli.store';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        code: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        if (user.email === ADMIN_EMAIL && user.role !== 'ADMIN') {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' },
          });
          user.role = 'ADMIN';
        }

        if (!user.password) return null;

        const { valid, needsRehash } = await verifyPassword(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        if (needsRehash) {
          await prisma.user.update({
            where: { id: user.id },
            data: { password: await hashPassword(credentials.password as string) },
          });
        }

        if (user.isTwoFactorEnabled) {
          const code = credentials.code as string | undefined;
          if (!code) throw new Error('2FA_REQUIRED');
          if (!user.twoFactorSecret) throw new Error('2FA_SETUP_ERROR');
          const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
          if (!isValid) throw new Error('INVALID_2FA_CODE');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' as const },
  callbacks: {
    async signIn({ user, account }: { user: { email?: string | null; id?: string; name?: string | null; role?: string }; account?: { provider?: string } }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        if (!user.email) return false;

        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { vendor: true },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || 'User',
              role: 'BUYER',
              password: null,
            },
            include: { vendor: true },
          });
        } else if (user.name && dbUser.name !== user.name) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { name: user.name },
          });
        }

        user.id = dbUser.id;
        user.role = dbUser.role || 'BUYER';
        return true;
      }

      return true;
    },
    async jwt({ token, user, account }: { token: Record<string, unknown>; user?: { id?: string; email?: string; role?: string }; account?: { provider?: string } }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role || 'BUYER';
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }: { session: { user?: Record<string, unknown> }; token: Record<string, unknown> }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
        if (token.email) session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
};

const handler = NextAuth(authOptions as never);

export { handler as GET, handler as POST };
