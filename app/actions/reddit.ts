'use server'

import db  from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

const RedditAccountSchema = z.object({
  redditUsername: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  karmaCount: z.number(),
});

export async function addRedditAccount(formData: z.infer<typeof RedditAccountSchema>) {
  try {
    // Validate the input
    const validatedData = RedditAccountSchema.parse(formData);
    
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    // Check if account already exists
    const existingAccount = await db.redditAccount.findFirst({
      where: {
        userId: session.user.id,
        redditUsername: validatedData.redditUsername,
      },
    });

    if (existingAccount) {
      return {
        success: false,
        error: "Reddit account already connected"
      };
    }

    // Create new Reddit account
    const redditAccount = await db.redditAccount.create({
      data: {
        userId: session.user.id,
        redditUsername: validatedData.redditUsername,
        accessToken: validatedData.accessToken,
        refreshToken: validatedData.refreshToken,
        tokenExpires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        karmaCount: validatedData.karmaCount,
      },
    });

    revalidatePath('/');
    
    return {
      success: true,
      data: redditAccount
    };
    
  } catch (error) {
    console.error("Failed to add Reddit account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add Reddit account"
    };
  }
}


const DeleteRedditAccountSchema = z.object({
  accountId: z.string()
});

export async function deleteRedditAccount(accountId: string) {
  try {
    // Validate the input
    const validatedData = DeleteRedditAccountSchema.parse({ accountId });
    
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    // Verify the account belongs to the user before deleting
    const existingAccount = await db.redditAccount.findFirst({
      where: {
        id: validatedData.accountId,
        userId: session.user.id,
      },
    });

    if (!existingAccount) {
      return {
        success: false,
        error: "Reddit account not found or unauthorized to delete"
      };
    }

    // Delete the Reddit account
    await db.redditAccount.delete({
      where: {
        id: validatedData.accountId,
      },
    });

    revalidatePath('/');
    
    return {
      success: true,
      message: "Reddit account successfully deleted"
    };
    
  } catch (error) {
    console.error("Failed to delete Reddit account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete Reddit account"
    };
  }
}
