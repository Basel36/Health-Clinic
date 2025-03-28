import * as z from "zod"
import { ImageHandler } from "@/utils/AuthHandlers";
import { DaySchema } from "./Essentials";





  
    
    export const ScheduleSchema = z.object({
      days: z.array(DaySchema) .min(1, "At least one day must be scheduled")
      .refine(
        (days) => {
          const selectedDays = days.map((item) => item.day);
          return new Set(selectedDays).size === selectedDays.length;
        },
        {
          message: "Each day can only be scheduled once",
        }
      ),
    });

    const sessionCostSchema = z.object({
      sessionCost: z.number().min(1, { message: "Session cost must be at least 1" }),
    })
    // Export the schema for use in your form

    export type sessionCostValue =z.infer<typeof sessionCostSchema>;
    export type ScheduleValue =z.infer<typeof ScheduleSchema>;
    