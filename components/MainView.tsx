"use client";
import {
  CalendarEventType,
  useDateStore,
  useEventStore,
  useViewStore,
} from "@/lib/store";
import MonthView from "./month-view";
import SideBar from "./sidebar/SideBar";
import WeekView from "./week-view";
import DayView from "./day-view";
import EventPopover from "./event-popover";
import { EventSummaryPopover } from "./event-summary-popover";
import { useEffect } from "react";
import dayjs from "dayjs";
import { EventRendererPopover } from "./event-renderer-popover";

export default function MainView({
  eventsData,
}: {
  eventsData: CalendarEventType[];
}) {
  const { selectedView } = useViewStore();

  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    setEvents,
    isListEventOpen,
    closeListEvent,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();

  useEffect(() => {
    const mappedEvents: CalendarEventType[] = eventsData.map((event) => ({
      id: event.id,
      date: dayjs(event.date),
      title: event.title,
      description: event.description,
      isRecurring: event?.isRecurring,
      recurringRule: event?.recurringRule,
    }));

    // console.log(mappedEvents);

    setEvents(mappedEvents);
  }, [eventsData, setEvents]);

  return (
    <div className="flex gap-6 px-6">
      {/* SideBar */}
      <SideBar />

      <div className="w-full flex-1 rounded-md bg-white">
        {selectedView === "month" && <MonthView />}
        {selectedView === "week" && <WeekView />}
        {selectedView === "day" && <DayView />}
      </div>
      {isPopoverOpen && (
        <EventPopover
          isOpen={isPopoverOpen}
          onClose={closePopover}
          date={userSelectedDate.format("YYYY-MM-DD")}
        />
      )}

      {isEventSummaryOpen && selectedEvent && (
        <EventSummaryPopover
          isOpen={isEventSummaryOpen}
          onClose={closeEventSummary}
          event={selectedEvent}
        />
      )}

      {isListEventOpen && (
        <EventRendererPopover
          isOpen={isListEventOpen}
          onClose={closeListEvent}
        />
      )}
    </div>
  );
}
