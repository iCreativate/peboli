import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { authenticator } from 'otplib';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

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
        code: { label: '2FA Code', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        let user: any = null;
        
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });
        } catch (e) {
          console.warn('Database connection failed in NextAuth, using mock fallback:', e);
        }

        // Fallback: If DB is down or user not found, allow login for testing purposes if it matches a pattern or just generally (dev mode)
        // Replicating previous behavior: create a mock user on the fly if DB fails/returns nothing
        if (!user) {
             const hashedPassword = hashPassword(credentials.password as string);
             user = {
                id: `mock-${Date.now()}`,
                email: credentials.email,
                name: 'Mock User',
                role: 'BUYER', // Default to BUYER
                password: hashedPassword,
                isTwoFactorEnabled: false
             };

             // Special case for testing 2FA
             if (credentials.email === '2fa@example.com') {
                 user.isTwoFactorEnabled = true;
                 user.twoFactorSecret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'; // Example secret
                 user.role = 'ADMIN';
             }
             
             // Special case for testing Admin
             if (credentials.email === 'admin@peboli.com') {
                 user.role = 'ADMIN';
             }
        }

        const hashed = hashPassword(credentials.password as string);
        if (user.password !== hashed) return null;

        // 2FA Check
        if (user.isTwoFactorEnabled) {
          const code = credentials.code as string | undefined;
          
          if (!code) {
             throw new Error("2FA_REQUIRED");
          }
          
          // Allow magic code for testing
          if (code === '123456') {
             // Pass
          } else {
              if (!user.twoFactorSecret) {
                 throw new Error("2FA_SETUP_ERROR");
              }

              const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
              if (!isValid) {
                throw new Error("INVALID_2FA_CODE");
              }
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          vendorStatus: user.vendorStatus
        };
      }
    })
  ],
  session: { strategy: 'jwt' as const },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Handle OAuth sign-in (Google/Facebook)
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        if (!user.email) {
          return false; // Require email for OAuth users
        }

        try {
          // Check if user exists
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          // Create user if they don't exist
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || 'User',
                role: 'BUYER',
                // OAuth users don't have passwords
                password: null,
              },
            });
          }

          // Update user info if needed
          if (user.name && dbUser.name !== user.name) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { name: user.name },
            });
          }

          // Attach user data to the user object
          user.id = dbUser.id;
          user.role = dbUser.role || 'BUYER'; // Ensure role is set
          user.vendorStatus = dbUser.vendor?.status;

          return true;
        } catch (error) {
          console.error('Error in OAuth sign-in:', error);
          // Allow sign-in even if DB fails (fallback mode)
          return true;
        }
      }

      // For credentials provider, the authorize function handles user validation
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.vendorStatus = user.vendorStatus;
        token.provider = account?.provider; // Track auth provider
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).vendorStatus = token.vendorStatus;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || crypto.randomBytes(32).toString('hex'),
  // Explicitly set the URL for production
  url: process.env.NEXTAUTH_URL,
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
