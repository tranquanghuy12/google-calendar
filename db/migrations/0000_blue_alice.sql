CREATE TABLE IF NOT EXISTS "events" (
    "id" serial PRIMARY KEY NOT NULL,
    "date" timestamp NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "isRecurring" boolean DEFAULT FALSE,
    "recurringRuleId" integer REFERENCES "recurring_events"("id")
);

CREATE TABLE IF NOT EXISTS "recurring_events" (
    "id" serial PRIMARY KEY NOT NULL,
    "frequency" text NOT NULL,
    "interval" integer DEFAULT 1,
    "count" integer,
    "until" timestamp
);