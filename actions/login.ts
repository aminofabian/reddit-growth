"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

const ERROR_MESSAGES = {
  INVALID_FIELDS: "Invalid fields!",
  EMAIL_NOT_EXIST: "Email does not exist!",
  CONFIRMATION_EMAIL_SENT: "Confirmation email sent!",
  INVALID_CREDENTIALS: "Invalid credentials!",
  SOMETHING_WENT_WRONG: "Something went wrong!",
};

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: ERROR_MESSAGES.INVALID_FIELDS };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: ERROR_MESSAGES.EMAIL_NOT_EXIST };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: ERROR_MESSAGES.CONFIRMATION_EMAIL_SENT };
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return { error: ERROR_MESSAGES.INVALID_CREDENTIALS };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || "/", // Directs the user on successful login
    });
  } catch (error) {
    // This is where we catch and handle login errors.
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: ERROR_MESSAGES.INVALID_CREDENTIALS };
        default:
          return { error: ERROR_MESSAGES.SOMETHING_WENT_WRONG };
      }
    }
    // This is the special case for the 'redirect' error thrown by Next.js.
    // We re-throw it so Next.js can handle the redirect.
    throw error;
  }
};
