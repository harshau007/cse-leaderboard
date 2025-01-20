import { calculateScore, getDb } from "@/lib/db";
import { fetchUserSubmissions } from "@/lib/leetcode";
import type { SubmissionStats } from "./types";
import { USERNAMES } from "./users";

export async function fetchAndUpdateUsers(): Promise<void> {
  const db = await getDb();

  for (const username of USERNAMES) {
    try {
      const response = await fetchUserSubmissions(username);

      if (
        !response.matchedUser ||
        !response.matchedUser.submitStats ||
        !response.matchedUser.submitStats.acSubmissionNum
      ) {
        throw new Error(`Invalid data structure for user: ${username}`);
      }

      const stats = response.matchedUser.submitStats.acSubmissionNum;

      const getStatByDifficulty = (difficulty: string): SubmissionStats =>
        stats.find((s) => s.difficulty === difficulty) || {
          difficulty,
          count: 0,
          submissions: 0,
        };

      const allStats = getStatByDifficulty("All");
      const easyStats = getStatByDifficulty("Easy");
      const mediumStats = getStatByDifficulty("Medium");
      const hardStats = getStatByDifficulty("Hard");

      const totalSolved = allStats.count;
      const totalSubmissions = allStats.submissions;
      const easySolved = easyStats.count;
      const mediumSolved = mediumStats.count;
      const hardSolved = hardStats.count;
      const score = calculateScore(easySolved, mediumSolved, hardSolved);

      await db.run(
        `
        INSERT OR REPLACE INTO users (
          username, profile_url, total_solved, easy_solved, medium_solved, hard_solved, total_submissions, score, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
        [
          username,
          response.matchedUser.profile.userAvatar,
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
          totalSubmissions,
          score,
        ]
      );
    } catch (error) {
      console.error(`Error updating user ${username}:`, error);
      continue;
    }
  }
}
