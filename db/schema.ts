import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  plan: text("plan").notNull().default("free"),
});

export const trees = pgTable("trees", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  themeLayout: text("theme_layout").notNull().default("editorial"),
  themeSkin: text("theme_skin").notNull().default("dark-gold"),
  isPublic: boolean("is_public").notNull().default(false),
  shareToken: text("share_token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  givenName: text("given_name").notNull(),
  surname: text("surname").notNull(),
  fullName: text("full_name").notNull(),
  suffix: text("suffix"),
  gender: text("gender").notNull().default("unknown"),
  birthDateText: text("birth_date_text"),
  birthDateNormalized: date("birth_date_normalized"),
  birthPlace: text("birth_place"),
  deathDateText: text("death_date_text"),
  deathDateNormalized: date("death_date_normalized"),
  deathPlace: text("death_place"),
  summary: text("summary"),
  biographyMd: text("biography_md"),
  isLiving: boolean("is_living").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const families = pgTable("families", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  spouse1Id: uuid("spouse_1_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  spouse2Id: uuid("spouse_2_id").references(() => people.id, { onDelete: "cascade" }),
  marriageDateText: text("marriage_date_text"),
  marriageDateNormalized: date("marriage_date_normalized"),
  marriagePlace: text("marriage_place"),
});

export const familyChildren = pgTable(
  "family_children",
  {
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id, { onDelete: "cascade" }),
    childId: uuid("child_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    order: integer("order"),
    relationshipType: text("relationship_type").notNull().default("biological"),
  },
  (table) => [primaryKey({ columns: [table.familyId, table.childId] })],
);

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  dateText: text("date_text"),
  dateNormalized: date("date_normalized"),
  place: text("place"),
  description: text("description"),
});

export const lineages = pgTable("lineages", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
});

export const lineageMembers = pgTable(
  "lineage_members",
  {
    lineageId: uuid("lineage_id")
      .notNull()
      .references(() => lineages.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
  },
  (table) => [primaryKey({ columns: [table.lineageId, table.personId] })],
);

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author"),
  url: text("url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  subjectType: text("subject_type").notNull(),
  subjectId: uuid("subject_id").notNull(),
  predicate: text("predicate").notNull(),
  valueText: text("value_text").notNull(),
  confidence: text("confidence").notNull().default("accepted"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const citations = pgTable("citations", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id")
    .notNull()
    .references(() => claims.id, { onDelete: "cascade" }),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  page: text("page"),
  notes: text("notes"),
});

export const reviewIssues = pgTable("review_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  subjectType: text("subject_type").notNull(),
  subjectId: uuid("subject_id").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"),
  resolutionNote: text("resolution_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const externalIds = pgTable("external_ids", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  subjectType: text("subject_type").notNull(),
  subjectId: uuid("subject_id").notNull(),
  system: text("system").notNull(),
  externalId: text("external_id").notNull(),
});

export const importJobs = pgTable("import_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  fileName: text("file_name").notNull(),
  storagePath: text("storage_path"),
  payloadJson: jsonb("payload_json"),
  counts: jsonb("counts").notNull(),
  issues: jsonb("issues").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
