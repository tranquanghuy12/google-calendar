import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import { db } from "@/db/drizzle";
import { CalendarEventType, RecurringRuleType } from "@/lib/store";
// import dayjs from "dayjs";

import { addDays, addWeeks, addMonths, isBefore } from "date-fns";

export function generateRecurringDates(
  startDate: Date,
  rule: RecurringRuleType,
) {
  const dates = [];
  let currentDate = new Date(startDate);
  const { frequency, interval, count, until } = rule;

  while (
    (count ? dates.length < count : true) &&
    (until ? isBefore(currentDate, new Date(until)) : true)
  ) {
    dates.push(new Date(currentDate));

    if (frequency === "daily") {
      currentDate = addDays(currentDate, interval || 1);
    } else if (frequency === "weekly") {
      currentDate = addWeeks(currentDate, interval || 1);
    } else if (frequency === "monthly") {
      currentDate = addMonths(currentDate, interval || 1);
    }
  }

  return dates;
}

const getEventsData = async () => {
  try {
    const data = await db.query.eventsTable.findMany({
      with: {
        recurringRule: true,
      },
    });

    const expandedEvents = [];

    for (const event of data) {
      if (event.isRecurring && event.recurringRule) {
        const recurringRule: RecurringRuleType = {
          frequency: event.recurringRule.frequency as
            | "daily"
            | "weekly"
            | "monthly",
          interval: event.recurringRule.interval,
          count: event.recurringRule.count,
          // until: event.recurringRule.until,
        };

        const recurringDates = generateRecurringDates(
          event.date,
          recurringRule,
        );
        expandedEvents.push(
          ...recurringDates.map((date) => ({ ...event, date })),
        );
      } else {
        expandedEvents.push(event);
      }
    }

    return expandedEvents;

    // // Convert the Dayjs object to a simple ISO string
    // return data.map((event) => ({
    //   ...event,
    //   date: dayjs(event.date).toISOString(), // Convert Dayjs to string
    // }));
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return [];
  }
};

export default async function Home() {
  const dbEvents = await getEventsData();

  return (
    <div className="bg-body">
      <Header />
      <MainView eventsData={dbEvents as unknown as CalendarEventType[]} />
    </div>
  );
}
