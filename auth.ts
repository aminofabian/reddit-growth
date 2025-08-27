import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import db from "@/lib/db";
import { UserRole } from "@prisma/client";
import type { DefaultSession, Account, Profile, User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Adapter } from "@auth/core/adapters";

// Augment the 'next-auth' and 'next-auth/jwt' modules
declare module "next-auth" {
  interface User {
    role: UserRole;
    firstName?: string | null;
    lastName?: string | null;
    emailVerified?: Date | null;
  }
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      firstName?: string | null;
      lastName?: string | null;
      emailVerified?: Date | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    firstName?: string | null;
    lastName?: string | null;
    emailVerified?: Date | null;
  }
}

// Correct the module augmentation for the adapter
declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserRole;
    firstName?: string | null;
    lastName?: string | null;
    emailVerified: Date | null;
    // Remove the optional '?' modifier here
    isTwoFactorEnabled: boolean;
  }
}

const ADMIN_EMAILS = ["aminofab@gmail.com", "eminselimaslan@gmail.com"];
const isAdminEmail = (email?: string | null) =>
  ADMIN_EMAILS.includes(email?.toLowerCase() ?? "");

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  events: {
    async linkAccount({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const email = profile?.email?.toLowerCase();
        const isAdmin = isAdminEmail(email);
        const updateData: any = {
          emailVerified: new Date(),
          role: isAdmin ? UserRole.ADMIN : UserRole.USER,
        };
        if (profile?.name) {
          const [firstName, ...lastNameParts] = profile.name.split(" ");
          updateData.firstName = firstName;
          updateData.lastName = lastNameParts.join(" ");
        }
        if (email) updateData.email = email;
        if (profile?.image) updateData.image = profile.image;
        try {
          await db.user.update({
            where: { id: user.id },
            data: updateData,
          });
        } catch (error) {
          console.error("Error updating user in linkAccount:", error);
        }
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      if (account?.provider !== "credentials") {
        if (isAdminEmail(user.email) && user.id) {
          await db.user.update({
            where: { id: user.id },
            data: { role: UserRole.ADMIN },
          });
        }
        return true;
      }
      const existingUser = await getUserById(user.id ?? "");
      if (!existingUser?.emailVerified) return false;
      if (
        isAdminEmail(existingUser.email) &&
        existingUser.role !== UserRole.ADMIN
      ) {
        await db.user.update({
          where: { id: user.id },
          data: { role: UserRole.ADMIN },
        });
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.name = token.name as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
        session.user.image = token.picture as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      if (
        isAdminEmail(existingUser.email) &&
        existingUser.role !== UserRole.ADMIN
      ) {
        await db.user.update({
          where: { id: existingUser.id },
          data: { role: UserRole.ADMIN },
        });
        existingUser.role = UserRole.ADMIN;
      }
      token.name = `${existingUser.firstName || ""} ${
        existingUser.lastName || ""
      }`.trim();
      token.firstName = existingUser.firstName;
      token.lastName = existingUser.lastName;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.picture = existingUser.image;
      token.emailVerified = existingUser.emailVerified;
      return token;
    },
  },
  ...authConfig,
});
