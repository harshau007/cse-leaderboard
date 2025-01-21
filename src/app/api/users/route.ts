import { getDb } from "@/lib/db";
import type { LeetCodeUser } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const db = await getDb();

    const result = await db.query<LeetCodeUser>(
      `
      SELECT 
        username,
        profile_url AS "profileUrl",
        total_solved AS "totalSolved",
        easy_solved AS "easySolved",
        medium_solved AS "mediumSolved",
        hard_solved AS "hardSolved",
        total_submissions AS "totalSubmissions",
        score,
        last_updated AS "lastUpdated"
      FROM users
      ORDER BY score DESC
      `
    );

    const formattedUsers = result.rows.map((user) => ({
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
