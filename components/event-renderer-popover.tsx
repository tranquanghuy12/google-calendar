"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import { useEventStore } from "@/lib/store";

interface EventRendererPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventRendererPopover({
  isOpen,
  onClose,
}: EventRendererPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { openEventSummary, listEventOpen } = useEventStore();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-25"
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">All events</h2>
          <div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <IoCloseSharp className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="group relative flex flex-col items-center gap-y-2 transition-all">
          {listEventOpen?.map((event) => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                openEventSummary(event);
              }}
              className="w-full"
            >
              <div className="line-clamp-1 w-[90%] cursor-pointer rounded-sm bg-green-700 p-1 text-sm text-white">
                {event.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
