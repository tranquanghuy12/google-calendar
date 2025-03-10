import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Events table schema
export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isRecurring: boolean("isRecurring").default(false),
  recurringRuleId: integer("recurringRuleId").references(
    () => recurringEventsTable.id,
    { onDelete: "set null" },
  ),
});

export const recurringEventsTable = pgTable("recurring_events", {
  id: serial("id").primaryKey(),
  frequency: text("frequency").notNull(), // "daily", "weekly", "monthly", "yearly"
  interval: integer("interval").default(1), // Every X days/weeks/months
  count: integer("count"), // Total occurrences
  until: timestamp("until"), // Recurrence end date
  // createdAt: timestamp("created_at").defaultNow(),
});

export const eventsRelations = relations(eventsTable, ({ one }) => ({
  recurringRule: one(recurringEventsTable, {
    fields: [eventsTable.recurringRuleId],
    references: [recurringEventsTable.id],
  }),
}));

export const recurringRulesRelations = relations(
  recurringEventsTable,
  ({ many }) => ({
    events: many(eventsTable),
  }),
);
