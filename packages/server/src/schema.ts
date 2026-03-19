import { relations, sql } from "drizzle-orm";
import {
  decimal,
  index,
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
  (t) => [index("problem_difficulty_idx").on(t.difficulty)],
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

export const languages = pgEnum("languages", ["js", "c", "cpp", "py", "java"]);

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
