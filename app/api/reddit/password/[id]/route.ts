import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const redditAccount = await db.redditAccount.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      select: {
        redditPassword: true
      }
    });

    if (!redditAccount) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      password: redditAccount.redditPassword
    });

  } catch (error) {
    console.error("Error fetching password:", error);
    return NextResponse.json(
      { error: "Failed to fetch password" },
      { status: 500 }
    );
  }
}