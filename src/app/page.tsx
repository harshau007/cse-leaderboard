import Leaderboard from "@/components/Leaderboard";
import { getDb } from "@/lib/db";
import type { LeetCodeUser } from "@/lib/types";
import { fetchAndUpdateUsers } from "@/lib/updateUsers";

async function getUsers(): Promise<LeetCodeUser[]> {
  const db = await getDb();

  await fetchAndUpdateUsers();

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

  return users.map((user) => ({
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
