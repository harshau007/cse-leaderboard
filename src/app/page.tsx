import Leaderboard from "@/components/Leaderboard";
import { getDb } from "@/lib/db";
import type { LeetCodeUser } from "@/lib/types";
import { fetchAndUpdateUsers } from "@/lib/updateUsers";

async function getUsers(): Promise<LeetCodeUser[]> {
  const db = await getDb();

  await fetchAndUpdateUsers();

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

  return result.rows.map((user) => ({
    ...user,
    lastUpdated: new Date(user.lastUpdated),
  }));
}

export default async function Home() {
  const users = await getUsers();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          LeetCode Leaderboard
        </h1>
        {users.length > 0 ? (
          <Leaderboard users={users} />
        ) : (
          <p className="text-center">
            No users found. Please check the API connection and try again.
          </p>
        )}
      </div>
    </main>
  );
}
