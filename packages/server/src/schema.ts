import { relations, sql } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const sessionTable = pgTable("session", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  userIp: text("user_ip").notNull().default("unknown"),
  userAgent: text("user_agent").notNull().default("unknown"),
  expiresAt: timestamp("expires_at", { mode: "string" })
    .notNull()
    .default(sql`NOW() + INTERVAL '30 days'`),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const difficultyLevel = pgEnum("difficulty_level", [
  "easy",
  "medium",
  "hard",
]);

export const problemsTable = pgTable(
  "problems",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    slug: text("slug").notNull().unique(),
    question: text("question").notNull(),
    name: text("name").notNull(),
    testCase: jsonb("test_case")
      .notNull()
      .$type<{ input: unknown; output: unknown }[]>(),
    difficulty: difficultyLevel().notNull().default("easy"),
    acceptance: decimal("acceptance", { precision: 5, scale: 2 })
      .notNull()
      .$type<number>(),

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (t) => [
    index("problem_difficulty_idx").on(t.difficulty),
    index("problem_slug_idx").on(t.slug),
  ],
);
export const problemsRelation = relations(problemsTable, ({ many }) => ({
  problemsToTags: many(problemsToTags),
}));

export const tagsTable = pgTable("tags", {
  id: uuid("id")
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull().unique(),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const tagsRelation = relations(tagsTable, ({ many }) => ({
  problemsToTags: many(problemsToTags),
}));

export const problemsToTags = pgTable(
  "problems_to_tags",
  {
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problemsTable.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.problemId, t.tagId] })],
);
export const problemsToTagsRelations = relations(problemsToTags, ({ one }) => ({
  problem: one(problemsTable, {
    fields: [problemsToTags.problemId],
    references: [problemsTable.id],
  }),
  tag: one(tagsTable, {
    fields: [problemsToTags.tagId],
    references: [tagsTable.id],
  }),
}));

export const languages = pgEnum("languages", ["js", "ts", "c", "cpp", "py"]);

export const starterCodeTable = pgTable(
  "starter_code",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    code: text("code").notNull(),
    language: languages().notNull(),

    problemId: uuid("problem_id")
      .notNull()
      .references(() => problemsTable.id, { onDelete: "cascade" }),
  },
  (t) => [unique().on(t.language, t.problemId)],
);

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "accepted",
  "wrong_answer",
  "time_limit_exceeded",
  "memory_limit_exceeded",
  "compilation_error",
  "runtime_error",
]);

export const submissionTable = pgTable(
  "submission",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    status: submissionStatusEnum("status").notNull().default("pending"),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problemsTable.id, { onDelete: "cascade" }),

    code: text("code").notNull(),
    language: languages("language").notNull(),
    testCasesPassed: integer("test_cases_passed").notNull().default(0),
    totalTestCases: integer("total_test_cases").notNull().default(0),
    executionTimeMs: integer("execution_time_ms"),
    memoryKb: integer("memory_kb"),
    errorMessage: text("error_message"),
    failedTestCase: jsonb("failed_test_case").$type<{
      input: unknown;
      expectedOutput: unknown;
      actualOutput: unknown;
    }>(),
    submittedAt: timestamp("submitted_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (t) => [
    index("submission_user_idx").on(t.userId),
    index("submission_problem_idx").on(t.problemId),
    index("submission_user_problem_idx").on(t.userId, t.problemId),
    index("submission_status_idx").on(t.status),
  ],
);

export const submissionRelations = relations(submissionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [submissionTable.userId],
    references: [userTable.id],
  }),
  problem: one(problemsTable, {
    fields: [submissionTable.problemId],
    references: [problemsTable.id],
  }),
}));
