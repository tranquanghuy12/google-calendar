import { cn } from "@/lib/utils";
import React from "react";
import Create from "./create";
import SideBarCalendar from "./side-bar-calendar";
// import SearchUsers from "./search-users";
// import MyCalendars from "./my-calendars";
import { useEventStore, useToggleSideBarStore } from "@/lib/store";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
import { IoMdCalendar } from "react-icons/io";

export default function SideBar() {
  const { isSideBarOpen } = useToggleSideBarStore();
  const { events } = useEventStore();

  const today = dayjs().startOf("day");
  const upcommingEvents = events
    ?.filter((event) => dayjs(event.date).isSameOrAfter(today))
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  return (
    <aside
      className={cn(
        "hidden w-96 rounded-md border-t bg-white px-6 py-3 transition-all duration-300 ease-in-out lg:block",
        !isSideBarOpen && "lg:hidden",
      )}
    >
      <div className="flex flex-col gap-10">
        <div>
          <Create />
          <SideBarCalendar />
        </div>
        {/* <SearchUsers /> */}
        {/* <MyCalendars /> */}
        <div className="border-t"></div>

        <div>
          <div className="mb-10 text-3xl font-bold text-primary">
            Upcomming Events
          </div>
          <div>
            {upcommingEvents?.slice(0, 3)?.map((event, index) => {
              return (
                <div
                  key={index}
                  className={`mb-4 rounded-xl ${event?.isRecurring ? "bg-secondary" : "bg-primary"} p-4`}
                >
                  <div className="space-y-10">
                    <div className="flex gap-6">
                      <div className="flex flex-col gap-y-2">
                        <div
                          className={`${event?.recurringRule ? "text-primary" : "text-secondary"} break-all text-xl font-semibold`}
                        >
                          {event.title}
                        </div>
                        <div
                          className={`${event?.recurringRule ? "text-primary-soft" : "text-secondary-soft"} text-md text-gray-600`}
                        >
                          {dayjs
                            .tz(dayjs.utc(event.date), "Asia/Ho_Chi_Minh")
                            .format("dddd, MMMM D, YYYY HH:mm A")}
                        </div>
                      </div>
                    </div>

                    {/* Add more event details here */}

                    <div className={`flex items-center gap-6`}>
                      <IoMdCalendar
                        className={`${event?.recurringRule ? "text-primary-soft" : "text-secondary-soft"} h-6 w-6 text-gray-600`}
                      />
                      <div
                        className={`${event?.recurringRule ? "text-primary-soft" : "text-secondary-soft"} text-md text-gray-600`}
                      >
                        Tran Quang Huy
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
