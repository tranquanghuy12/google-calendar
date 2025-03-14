"use client";

import { RecurringRuleType } from "@/lib/store";
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
