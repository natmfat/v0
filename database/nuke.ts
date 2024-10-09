import { sql } from "~/.server/database";

// who needs database migrations???
await nukeDatabase();
process.exit(0);

async function nukeDatabase() {
  await sql`DROP SCHEMA public CASCADE`;
  await sql`CREATE SCHEMA public`;
}
