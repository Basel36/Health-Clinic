import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { ImageHandler } from "@/utils/AuthHandlers";
export interface ISignUpData {
  data: Accounts;
  role:String;
}


    export const PatientSchema = z.object({
      profilePic: z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      }).optional(),
      name: z.string().min(3, "Name is required").regex(
        /^[a-zA-Z0-9\s]*$/,
        "Name can only contain letters, numbers, and spaces"
      ),
      email: z.string().email("Invalid email address"),
      phoneNumbers:z.array(z.string().regex(/^\d{11}$/, "Phone number must be 11 digits")).nonempty({
        message: "At least one phone is required",
      }),

      address: z.array(z.string().min(5, "Address cannot be below 5 characters")).nonempty({
        message: "At least one address is required",
      }),
      
      gender: z.enum(["male", "female"], {
        required_error: "Please select a gender",
      }),
      dateOfBirth: z.date({
        required_error: "Date of birth is required",
      }),
      password: z.string().min(6, "Password must be at least 8 characters"),
      passwordConfirm: z.string().min(6, "Password must be at least 8 characters"),
    }).refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    });

    
    
    
    // Export the schema for use in your form

    export type PatientValue =z.infer<typeof PatientSchema>;

    