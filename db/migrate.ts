import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { join } from "path";

// Load .env.local file
dotenv.config({ path: join(process.cwd(), ".env.local") });

const connectionString = process.env.DB_CONNECTION_STRING;

console.log("Database URL:", connectionString ? "Found" : "Not found");

const runMigrate = async () => {
  if (!connectionString) {
    throw new Error("DB_CONNECTION_STRING is not defined in .env.local");
  }

  // Parse connection string to extract parts and avoid URL parsing issues
  // The postgres library tries to decodeURIComponent internally, which can fail
  // if the password has special characters. We'll parse it manually using regex
  // to avoid URL parsing errors.
  let sql: ReturnType<typeof postgres>;

  // Use regex to parse connection string - this avoids URL parsing errors
  // Format: postgres(ql)://user:password@host:port/database?params
  const match = connectionString.match(
    /postgres(ql)?:\/\/([^:]+):([^@]+)@([^\/:]+):?(\d+)?\/([^\?]+)/
  );

  if (match) {
    const [, , user, password, host, port, database] = match;

    // Password may be URL-encoded or not. We'll try to decode it carefully.
    // If decoding fails, use it as-is (it might already be decoded or have special chars)
    let decodedPassword = password;
    try {
      // Try decoding once - if it fails, use original
      decodedPassword = decodeURIComponent(password);
    } catch {
      // If decodeURIComponent fails, the password might have invalid encoding
      // or already be decoded. Use it as-is.
      decodedPassword = password;
    }

    // Decode username and database name
    let decodedUser = user;
    try {
      decodedUser = decodeURIComponent(user);
    } catch {
      decodedUser = user;
    }

    let decodedDatabase = database;
    try {
      decodedDatabase = decodeURIComponent(database);
    } catch {
      decodedDatabase = database;
    }

    sql = postgres({
      host: host,
      port: port ? parseInt(port) : 5432,
      database: decodedDatabase,
      user: decodedUser,
      password: decodedPassword,
      max: 1,
      ssl: "require",
    });
  } else {
    // Fallback: try URL parsing if regex doesn't match
    try {
      const url = new URL(connectionString);
      sql = postgres({
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
        max: 1,
        ssl: "require",
      });
    } catch (error) {
      throw new Error(
        `Failed to parse connection string. Please ensure it's in the format: postgres://user:password@host:port/database. Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  const db = drizzle(sql);

  console.log("⏳ Running migrations...");

  try {
    const start = Date.now();
    await migrate(db, { migrationsFolder: "./db/migrations" });
    const end = Date.now();
    console.log(`✅ Migrations completed in ${end - start}ms`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await sql.end();
  }

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
