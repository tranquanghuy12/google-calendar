"use server";

import { db } from "@/db/drizzle";
import { eventsTable, recurringEventsTable } from "@/db/schema";
import { RecurringRuleType } from "@/lib/store";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// export async function createEvent(
//   formData: FormData,
// ): Promise<{ error: string } | { success: boolean }> {
//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string;
//   const date = formData.get("date") as string;
//   const time = formData.get("time") as string;

//   if (!title || !description || !date || !time) {
//     return { error: "All fields are required" };
//   }

//   const dateTime = new Date(`${date}T${time}:00`);

//   try {
//     await db.insert(eventsTable).values({
//       title,
//       description,
//       date: dateTime,
//     });

//     // Revalidate the path and return a success response
//     revalidatePath("/");

//     return { success: true }; // Return success instead of revalidatePath directly
//   } catch (error) {
//     console.error("Error creating event:", error);
//     return { error: "Failed to create event" };
//   }
// }

export async function createEvent(
  formData: FormData,
): Promise<{ error: string } | { success: boolean }> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const isRecurring = formData.get("isRecurring") as unknown as boolean;
  const recurringRule = JSON.parse(
    formData.get("recurringRule") as string,
  ) as unknown as RecurringRuleType;

  if (
    !title ||
    !description ||
    !date ||
    !time ||
    (recurringRule?.frequency !== " " && !recurringRule?.count)
  ) {
    return { error: "All fields are required" };
  }

  const dateTime = new Date(`${date}T${time}:00`);

  let recurringRuleId = null;

  if (isRecurring && recurringRule) {
    const [rule] = await db
      .insert(recurringEventsTable)
      .values({
        ...recurringRule,
        until: recurringRule.until ? new Date(recurringRule.until) : null,
      })
      .returning({ id: recurringEventsTable.id });
    recurringRuleId = rule.id;
  }

  try {
    await db.insert(eventsTable).values({
      title,
      description,
      date: dateTime,
      isRecurring,
      recurringRuleId,
    });

    // Revalidate the path and return a success response
    revalidatePath("/");

    return { success: true }; // Return success instead of revalidatePath directly
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  }
}

export async function deleteEvent(eventId: number) {
  try {
    await await db.delete(eventsTable).where(eq(eventsTable.id, eventId));

    // Revalidate the path and return a success response
    revalidatePath("/");

    return { success: true }; // Return success instead of revalidatePath directly
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  }
}
