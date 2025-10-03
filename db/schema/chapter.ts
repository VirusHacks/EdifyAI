import {
  pgTable,
  serial,
  varchar,
  json,
  boolean,
  integer,
  real,
  text,
  jsonb,
  timestamp,

} from "drizzle-orm/pg-core";

  export const CourseList = pgTable("courseList", {
    id: serial("id").primaryKey(),
    courseId: varchar("courseId").notNull(),
    courseName: varchar("name").notNull(),
    category: varchar("category").notNull(),
    level: varchar("level").notNull(),
    courseOutput: json("courseOutput").notNull(),
    isVideo: varchar("isVideo").notNull().default("Yes"),
    username: varchar("username"),
    userprofileimage: varchar("userprofileimage"),
    createdBy: varchar("createdBy"),
    courseBanner: varchar("courseBanner"),
    isPublished: boolean("isPublished").notNull().default(false),
    progress: real("progress").notNull().default(0.0),
  });

  export const CourseChapters = pgTable("courseChapters", {
    id: serial("id").primaryKey(),
    courseId: varchar("courseId").notNull(),
    chapterId: integer("chapterId").notNull(),
    content: json("content").notNull(),
    videoId: varchar("videoId").notNull(),
    quiz: json("quiz").notNull(),
  });

  export const pathways = pgTable('pathways', {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    estimatedTime: text('estimated_time').notNull(),
    difficulty: text('difficulty').notNull(),
    prerequisites: jsonb('prerequisites').$type<string[]>().notNull(),
    steps: jsonb('steps').$type<{
      title: string;
      description: string;
      resources: { title: string; url: string }[];
      estimatedTime: string;
    }[]>().notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  
  export const userProgress = pgTable('user_progress', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    pathwayId: integer('pathway_id').references(() => pathways.id),
    completedSteps: integer('completed_steps').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  
  export const forumTopics = pgTable('forum_topics', {
    id: serial('id').primaryKey(),
    courseId: integer('course_id').notNull().references(() => CourseList.id),
    userId: varchar('user_id').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  
  export const forumReplies = pgTable('forum_replies', {
    id: serial('id').primaryKey(),
    topicId: integer('topic_id').notNull().references(() => forumTopics.id),
    userId: varchar('user_id').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });