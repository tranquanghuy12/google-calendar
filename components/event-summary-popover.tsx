"use client";

import React, { useRef, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { CalendarEventType, useEventStore } from "@/lib/store";
import { deleteEvent } from "@/app/actions/event-actions";
import { IoMdCalendar } from "react-icons/io";

interface EventSummaryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventType;
}

export function EventSummaryPopover({
  isOpen,
  onClose,
  event,
}: EventSummaryPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { listEventOpen, openListEvent } = useEventStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDeleteEvent = useCallback(async () => {
    try {
      await deleteEvent(event?.id);
      if (listEventOpen && listEventOpen.length > 0) {
        openListEvent(listEventOpen.filter((e) => e?.id !== event?.id));
      }
      setTimeout(() => {
        onClose();
      }, 200);
    } catch (error) {
      console.log(error);
    }
  }, [event?.id, onClose, listEventOpen, openListEvent]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold"></h2>
          <div>
            <Button
              className="mr-2"
              variant="ghost"
              size="icon"
              onClick={handleDeleteEvent}
            >
              <MdDeleteOutline className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <IoCloseSharp className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="space-y-10">
          <div className="flex gap-6">
            <div className="flex w-6 justify-center">
              <div className="mt-2 h-4 w-4 rounded-full bg-violet-500"></div>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="break-all text-2xl">{event.title}</div>
              <div className="text-md text-gray-600">
                {dayjs
                  .tz(dayjs(event.date), "Asia/Ho_Chi_Minh")
                  .format("dddd, MMMM D, YYYY HH:mm A")}
              </div>
            </div>
          </div>

          {/* Add more event details here */}

          <div className="flex items-center gap-6">
            <IoMdCalendar className="h-6 w-6 text-gray-600" />
            <div className="text-md text-gray-600">Tran Quang Huy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
