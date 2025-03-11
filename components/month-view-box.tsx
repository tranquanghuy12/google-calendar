import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React from "react";
import { EventRenderer } from "./event-renderer";

export default function MonthViewBox({
  day,
  rowIndex,
}: {
  day: dayjs.Dayjs | null;
  rowIndex: number;
}) {
  const { openPopover, events } = useEventStore();

  const { setDate } = useDateStore();

  if (!day) {
    return (
      <div className="h-12 w-full border md:h-28 md:w-full lg:h-full"></div>
    );
  }

  const isFirstDayOfMonth = day.date() === 1;

  const isToday = day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate(day);
    openPopover();
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-y-2 border",
        "transition-all hover:bg-violet-50",
      )}
      onClick={handleClick}
    >
      <div className="mt-1 flex flex-col items-center">
        {rowIndex === 0 && (
          <h4 className="text-xs text-gray-500">
            {day.format("ddd").toUpperCase()}
          </h4>
        )}
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-center text-sm",
            isToday && "bg-primary text-white",
          )}
        >
          <p className="text-center">
            {isFirstDayOfMonth ? day.format("MMM D") : day.format("D")}
          </p>
        </div>
      </div>
      <EventRenderer date={day} view="month" events={events} />
    </div>
  );
}
