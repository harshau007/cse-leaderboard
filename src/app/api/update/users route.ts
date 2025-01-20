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

      await db.run(
        `
        INSERT OR REPLACE INTO users (
          username, profile_url, total_solved, easy_solved, medium_solved, hard_solved, score, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
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
