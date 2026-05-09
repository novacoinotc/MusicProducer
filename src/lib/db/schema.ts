import {
  pgTable,
  uuid,
  varchar,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

/**
 * Anonymous session id stored as a cookie. Lets the user keep progress without
 * an account. When auth lands we'll migrate sessions to user records.
 */
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Generic progress entry — covers groove lessons, synth challenges,
 * arrangement views, deconstruction notes, weekly challenge checklists, etc.
 * `module` + `itemId` is the unique key per session.
 */
export const moduleProgress = pgTable(
  "module_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .references(() => sessions.id, { onDelete: "cascade" })
      .notNull(),
    module: varchar("module", { length: 32 }).notNull(),
    itemId: varchar("item_id", { length: 64 }).notNull(),
    status: varchar("status", { length: 16 }).notNull().default("in_progress"),
    score: integer("score"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("module_progress_session_idx").on(t.sessionId),
    index("module_progress_lookup_idx").on(t.sessionId, t.module, t.itemId),
  ],
);

/**
 * Best streak per ear-training mode. Updated optimistically from the client.
 */
export const earStreaks = pgTable(
  "ear_streaks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .references(() => sessions.id, { onDelete: "cascade" })
      .notNull(),
    mode: varchar("mode", { length: 32 }).notNull(),
    bestStreak: integer("best_streak").notNull().default(0),
    totalCorrect: integer("total_correct").notNull().default(0),
    totalAttempts: integer("total_attempts").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("ear_streaks_session_idx").on(t.sessionId, t.mode)],
);

/**
 * User-saved drum patterns and synth presets so they can come back to them.
 */
export const savedItems = pgTable(
  "saved_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .references(() => sessions.id, { onDelete: "cascade" })
      .notNull(),
    kind: varchar("kind", { length: 16 }).notNull(), // "groove" | "synth"
    name: varchar("name", { length: 80 }).notNull(),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("saved_items_session_idx").on(t.sessionId, t.kind)],
);

export type Session = typeof sessions.$inferSelect;
export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type EarStreak = typeof earStreaks.$inferSelect;
export type SavedItem = typeof savedItems.$inferSelect;
