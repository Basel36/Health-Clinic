import * as z from "zod"

import { ImageHandler } from "@/utils/AuthHandlers";
import { DaySchema } from "./Essentials";


    export const LabSchema = z.object({
      profilePic: z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      }).optional(),
      name: z.string().min(3, "Name is required"),
      email: z.string().email("Invalid email address"),
      phoneNumbers:z.array(z.string().regex(/^\d{11}$/, "Phone number must be 11 digits")).nonempty({
        message: "At least one phone is required",
      }),
      address: z.array(z.string().min(5, "Address cannot be below 5 characters")).nonempty({
        message: "At least one address is required",
      }),
      
      license: z.array(z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      })).nonempty({
        message: "At least one License is required",
      }),
      password: z.string().min(6, "Password must be at least 8 characters"),
      passwordConfirm: z.string().min(6, "Password must be at least 8 characters"),
    }).refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    });

    

    export const LabScheduleSchema = z.object({
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
    
    
    // Export the schema for use in your form
    export type LabValue =z.infer<typeof LabSchema>;
    export type LabScheduleValue =z.infer<typeof LabScheduleSchema>;
    
    