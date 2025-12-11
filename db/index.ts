import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

// Option 1: Use Supabase client with Drizzle (shares connection pool)
// This prevents connection conflicts by using Supabase's managed connections
function createSupabaseDb() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for server-side queries
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Note: This requires drizzle-orm/supabase adapter
  // For now, we'll use the postgres approach with better connection management
  return null;
}

// Option 2: Use postgres.js with optimized connection settings for Supabase
const connectionString = process.env.DB_CONNECTION_STRING!;

if (!connectionString) {
  throw new Error("DB_CONNECTION_STRING environment variable is not set");
}

// Lazy connection - only creates connection when needed and closes it quickly
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!dbInstance) {
    const client = postgres(connectionString, {
      max: 1, // Single connection
      idle_timeout: 20, // Close after 20 seconds of inactivity
      connect_timeout: 10, // Increase timeout to 10 seconds for better reliability
      ssl: "require",
      onnotice: () => {},
      prepare: false,
      connection: {
        statement_timeout: 10000, // 10 seconds
      },
    });

    dbInstance = drizzle(client);
  }
  return dbInstance;
}

// Export the database instance
// Connection is created lazily when getDb() is first called
export default getDb();
