import { sql } from "~/database.server";

await nukeDatabase();
process.exit(0);

async function nukeDatabase() {
  await sql`DROP SCHEMA public CASCADE`;
  await sql`CREATE SCHEMA public`;
}
