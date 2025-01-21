import { calculateScore, getDb } from "@/lib/db";
import { fetchUserSubmissions } from "@/lib/leetcode";
import { PoolClient } from "pg";
import type { SubmissionStats } from "./types";
import { USERNAMES } from "./users";

async function updateRanks(db: PoolClient): Promise<void> {
  const result = await db.query(`
    SELECT username, score, current_rank
    FROM users
    ORDER BY score DESC, total_solved DESC
  `);

  const users = result.rows;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const newRank = i + 1;

    if (user.current_rank !== newRank) {
      await db.query(
        `
        UPDATE users
        SET previous_rank = current_rank,
            current_rank = $1
        WHERE username = $2
      `,
        [newRank, user.username]
      );
    }
  }
}

export async function fetchAndUpdateUsers(): Promise<void> {
  const db = await getDb();

  try {
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

        await db.query(
          `
    INSERT INTO users (
      username, profile_url, total_solved, easy_solved, medium_solved, hard_solved, total_submissions, score, last_updated
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (username)
    DO UPDATE SET 
      profile_url = EXCLUDED.profile_url,
      total_solved = EXCLUDED.total_solved,
      easy_solved = EXCLUDED.easy_solved,
      medium_solved = EXCLUDED.medium_solved,
      hard_solved = EXCLUDED.hard_solved,
      total_submissions = EXCLUDED.total_submissions,
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
            totalSubmissions,
            score,
          ]
        );
      } catch (error) {
        console.error(`Error updating user ${username}:`, error);
        continue;
      }
    }

    await updateRanks(db);
  } finally {
    db.release();
  }
}
