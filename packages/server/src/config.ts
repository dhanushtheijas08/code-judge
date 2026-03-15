import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

const pg = new SQL({
  adapter: "postgres",
  host: "localhost",
  port: 5433,
  database: "postgres",
  password: "test",
  username: "test",
  onconnect: () => {
    console.log("Connected to PostgreSQL");
  },
  onclose(err: any) {
    console.error("PostgreSQL connection closed:", {
      message: err?.message,
      code: err?.code,
      stack: err?.stack,
    });
  },
});

export const db = drizzle({ client: pg });
