"use client";

import React, { useRef, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { CalendarEventType } from "@/lib/store";
import { deleteEvent } from "@/app/actions/event-actions";

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
      setTimeout(() => {
        onClose();
      }, 200);
    } catch (error) {
      console.log(error);
    }
  }, [event?.id, onClose]);

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
          <h2 className="text-xl font-semibold">Event Summary</h2>
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
        <div className="space-y-2">
          <p>
            <strong>Title:</strong> {event.title}
          </p>
          {/* Format the date before displaying it */}
          <p>
            <strong>Date:</strong>{" "}
            {dayjs(event.date).format("dddd, MMMM D, YYYY h:mm A")}
          </p>
          {/* Add more event details here */}
        </div>
      </div>
    </div>
  );
}
