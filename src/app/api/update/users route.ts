import { calculateScore, getDb } from "@/lib/db";
import { fetchUserSubmissions } from "@/lib/leetcode";
import { USERNAMES } from "@/lib/users";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const db = await getDb();

  try {
    for (const username of USERNAMES) {
      const response = await fetchUserSubmissions(username);
      console.log(response);
      const stats = response.matchedUser.submitStats.acSubmissionNum;

      const easySolved = stats.find((s) => s.difficulty === "Easy")?.count || 0;
      const mediumSolved =
        stats.find((s) => s.difficulty === "Medium")?.count || 0;
      const hardSolved = stats.find((s) => s.difficulty === "Hard")?.count || 0;
      const totalSolved = easySolved + mediumSolved + hardSolved;
      const score = calculateScore(easySolved, mediumSolved, hardSolved);

      await db.query(
        `
        INSERT INTO users (
          username, profile_url, total_solved, easy_solved, medium_solved, hard_solved, score, last_updated
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (username)
        DO UPDATE SET
          profile_url = EXCLUDED.profile_url,
          total_solved = EXCLUDED.total_solved,
          easy_solved = EXCLUDED.easy_solved,
          medium_solved = EXCLUDED.medium_solved,
          hard_solved = EXCLUDED.hard_solved,
          score = EXCLUDED.score,
          last_updated = NOW();
        `,
        [
          username,
          response.matchedUser.profile.userAvatar,
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
          score,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Users updated successfully",
    });
  } catch (error) {
    console.error("Error updating users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update users" },
      { status: 500 }
    );
  }
}
