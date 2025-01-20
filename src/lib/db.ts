import { open, Database as SqliteDatabase } from "sqlite";
import sqlite3 from "sqlite3";
import { POINTS } from "./points";

let db: SqliteDatabase<sqlite3.Database> | null = null;

export async function getDb(): Promise<SqliteDatabase<sqlite3.Database>> {
  if (!db) {
    db = await open({
      filename: "./leetcode.db",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        profile_url TEXT,
        total_solved INTEGER,
        easy_solved INTEGER,
        medium_solved INTEGER,
        hard_solved INTEGER,
        total_submissions INTEGER,
        score INTEGER,
        last_updated DATETIME
      )
    `);
  }

  return db;
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

export function calculateScore(
  easy: number,
  medium: number,
  hard: number
): number {
  return easy * POINTS.EASY + medium * POINTS.MEDIUM + hard * POINTS.HARD;
}
