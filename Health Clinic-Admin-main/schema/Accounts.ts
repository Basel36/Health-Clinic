import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { ImageHandler } from "@/utils/AuthHandlers";
export interface ISignUpData {
  data: Accounts;
  role:String;
}
const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const DaysOfWeek=[
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
export const userTypeSchema = z.object({
      userType: z.enum(["doctor", "patient", "lab", "pharmacy"], {
        required_error: "Please select a user type.",
      }),
    })
    

    export const PatientSchema = z.object({
      profilePic: z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      }).optional(),
      name: z.string().min(3, "Name is required"),
      email: z.string().email("Invalid email address"),
      phone:z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
      addresses: z.array(z.string().min(5, "Address cannot be below 5 characters")).nonempty({
        message: "At least one address is required",
      }),
      
      gender: z.enum(["male", "female"], {
        required_error: "Please select a gender",
      }),
      DateOfBirth: z.date({
        required_error: "Date of birth is required",
      }),
      password: z.string().min(6, "Password must be at least 8 characters"),
      passwordConfirm: z.string().min(6, "Password must be at least 8 characters"),
    }).refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    });

    export const PharmacySchema = z.object({
      profilePic: z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      }).optional(),
      name: z.string().min(3, "Name is required"),
      email: z.string().email("Invalid email address"),
      phone:z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
      addresses: z.array(z.string().min(5, "Address cannot be below 5 characters")).nonempty({
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
    export const DoctorSchema = z.object({
      profilePic: z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      }).optional(),
      name: z.string().min(3, "Name is required"),
      email: z.string().email("Invalid email address"),
      phone:z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
      addresses: z.array(z.string().min(5, "Address cannot be below 5 characters")).nonempty({
        message: "At least one address is required",
      }),
      
      gender: z.enum(["male", "female"], {
        required_error: "Please select a gender",
      }),
      DateOfBirth: z.date({
        required_error: "Date of birth is required",
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
    export const LabSchema = z.object({
      profilePic: z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      }).optional(),
      name: z.string().min(3, "Name is required"),
      email: z.string().email("Invalid email address"),
      phone:z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
      addresses: z.array(z.string().min(5, "Address cannot be below 5 characters")).nonempty({
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
    const DaySchema = z.object({
      day: z.enum(DaysOfWeek  ,{  errorMap: () => ({ message: "You have to choose day" }),}),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,  "Please Enter Start Time"),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please Enter End Time"),
      limit: z.coerce.number().int().positive(),
    });
    
    export const DoctorScheduleschema = z.object({
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
      cost: z.coerce.number().min(0,"Cost must be a positive number"),
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

    export type userTypeValue =z.infer<typeof userTypeSchema>;
    export type PatientValue =z.infer<typeof PatientSchema>;
    export type DoctorValue =z.infer<typeof DoctorSchema>;
    export type LabValue =z.infer<typeof LabSchema>;
    export type PharmacyValue =z.infer<typeof PharmacySchema>;
    export type DoctorScheduleschemaValue =z.infer<typeof DoctorScheduleschema>;
    export type LabScheduleValue =z.infer<typeof LabScheduleSchema>;
    export type Accounts = PatientValue| DoctorValue| signupValue3;
    