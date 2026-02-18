import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js"

const { DATABASE_URL } = process.env

if (!DATABASE_URL) throw new Error("Database credentials is missing")

const client = postgres(DATABASE_URL)
const db = drizzle({ client })

export default db;