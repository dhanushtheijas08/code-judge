import { Queue } from "bullmq";
import { RedisClient, SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

const pg = new SQL({
  adapter: "postgres",
  host: "localhost",
  port: 5433,
  database: "postgres",
  password: "test",
  username: "test",
  onconnect: () => {},
  onclose(err: any) {
    console.error("PostgreSQL connection closed:", {
      message: err?.message,
      code: err?.code,
      stack: err?.stack,
    });
  },
});

export const db = drizzle({ client: pg });

export const redisClient = new RedisClient(Bun.env.REDIS_URL);

export const submissionQueue = new Queue("submission", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: 100,
    removeOnFail: {
      age: 1000 * 60 * 60 * 24,
      count: 100,
      limit: 100,
    },
  },
});
