// Local-only Postgres (PGlite) so the form works on your machine without Docker or an account.
// Data lives in ./.pglite (gitignored). Usage: npm run db:dev, then set the DATABASE_URL it prints.
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const port = 5433;
const db = await PGlite.create("./.pglite");
const dir = new URL("../db/migrations/", import.meta.url);
for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(new URL(file, dir), "utf8"));
}
const server = new PGLiteSocketServer({ db, port, host: "127.0.0.1" });
await server.start();
console.log("Local dev database is up. Put this in .env.local:");
console.log(`DATABASE_URL=postgres://postgres:postgres@127.0.0.1:${port}/postgres?sslmode=disable`);
process.on("SIGINT", async () => {
  await server.stop();
  await db.close();
  process.exit(0);
});
