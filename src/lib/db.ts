import { Pool, type PoolClient } from "pg";
import { POINTS } from "./points";

let pool: Pool | null = null;

export async function getDb(): Promise<PoolClient> {
  if (!pool) {
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: Number.parseInt(process.env.POSTGRES_PORT || "5432"),
    });

    const client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        profile_url TEXT,
        total_solved INTEGER,
        easy_solved INTEGER,
        medium_solved INTEGER,
        hard_solved INTEGER,
        total_submissions INTEGER,
        score INTEGER,
        previous_rank INTEGER,
        current_rank INTEGER,
        last_updated TIMESTAMP
      )
    `);

    client.release();
  }

  return pool.connect();
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export function calculateScore(
  easy: number,
  medium: number,
  hard: number
): number {
  return easy * POINTS.EASY + medium * POINTS.MEDIUM + hard * POINTS.HARD;
}
