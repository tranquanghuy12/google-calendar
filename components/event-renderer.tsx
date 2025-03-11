import { CalendarEventType, useEventStore } from "@/lib/store";

import dayjs from "dayjs";
import React from "react";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
};

export function EventRenderer({ date, view, events }: EventRendererProps) {
  const { openEventSummary, openListEvent } = useEventStore();

  const filteredEvents = events.filter((event: CalendarEventType) => {
    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }
  });

  return (
    <>
      {filteredEvents?.slice(0, view === "month" ? 4 : 1)?.map((event) => (
        <div
          key={event.id}
          onClick={(e) => {
            e.stopPropagation();
            openEventSummary(event);
          }}
          className="w-full"
        >
          <div
            className={`${event?.isRecurring ? "bg-secondary text-primary" : "bg-primary-soft text-white"} line-clamp-1 flex w-[90%] cursor-pointer rounded-sm text-sm`}
          >
            <div
              className={`${event?.isRecurring ? "bg-primary-soft" : "bg-secondary"} w-[3px]`}
            ></div>
            <p className="p-1">{event.title}</p>
          </div>
        </div>
      ))}
      {filteredEvents.length > (view === "month" ? 4 : 1) && (
        <div
          // key={event.id}
          onClick={(e) => {
            e.stopPropagation();
            openListEvent(filteredEvents);
          }}
          className="w-full"
        >
          <div className="line-clamp-1 w-[90%] cursor-pointer rounded-sm bg-gray-500 p-1 text-sm text-white">
            + {filteredEvents.length - (view === "month" ? 4 : 1)} more
          </div>
        </div>
      )}
    </>
  );
}
