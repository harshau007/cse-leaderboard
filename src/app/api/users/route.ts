import { getDb } from "@/lib/db";
import type { LeetCodeUser } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb();

    const users = await db.all<LeetCodeUser[]>(`
      SELECT 
        username,
        profile_url as profileUrl,
        total_solved as totalSolved,
        easy_solved as easySolved,
        medium_solved as mediumSolved,
        hard_solved as hardSolved,
        total_submissions as totalSubmissions,
        score,
        last_updated as lastUpdated
      FROM users
      ORDER BY score DESC
    `);

    const formattedUsers = users.map((user) => ({
      ...user,
      lastUpdated: new Date(user.lastUpdated).toISOString(),
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
