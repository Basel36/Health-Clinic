  import * as z from "zod"
import { ImageHandler } from "@/utils/AuthHandlers";
import { DaySchema, Doctors_Specializations } from "./Essentials";



    export const DoctorSchema = z.object({
      profilePic: z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      }).optional(),
      name: z.string().min(3, "Name is required").regex(
        /^[a-zA-Z0-9\s]*$/,
        "Name can only contain letters, numbers, and spaces"
      ),
      email: z.string().email("Invalid email address"),
      about: z.string().min(5,"About must be at least 5 characters"),
      phoneNumbers:z.array(z.string().regex(/^\d{11}$/, "Phone number must be 11 digits")).nonempty({
        message: "At least one phone is required",
      }),
      address: z.array(z.string().min(5, "Address cannot be below 5 characters")).nonempty({
        message: "At least one address is required",
      }),
      
      gender: z.enum(["male", "female"], {
        required_error: "Please select a gender",
      }),
      specialization: z.enum(Doctors_Specializations, {
        required_error: "Please select a Specialiaztion",
      }),
      dateOfBirth: z.date({
        required_error: "Date of birth is required",
      }),
      license: z.array(z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      })).nonempty({
        message: "At least one License is required",
      }),
      password: z.string().min(6, "Password must be at least 8 characters"),
      passwordConfirm: z.string().min(6, "Password must be at least 8 characters"),
    }).refine((data:{password:string,passwordConfirm:string}) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
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

    


export const ReservationSchema = z.object({
  diagnose: z.string().min(3, "Diagnosis is required"),
  medicine: z.array(z.object({
        name: z.string().min(3, "Medication name is required"),
        dose: z.string().min(2, "Dose is required"),
      })),
      requestedTests: z.array(z.string().min(1, "Test name is required")),
      consultationDate: z.string().min(1, "Consultation date is required").refine((value:string) => {
        const inputDate = new Date(value);
        const today = new Date();
    
        // Remove the time part by setting hours, minutes, seconds, and milliseconds to 0
        today.setHours(0, 0, 0, 0);
    
        // Check if the input date is today or in the future
        return inputDate >= today;
      }, {
        message: 'Date must not be before today', // Custom error message
      }).nullish(),
})


    // Export the schema for use in your form

    export type DoctorValue =z.infer<typeof DoctorSchema>;
    export type DoctorScheduleschemaValue =z.infer<typeof DoctorScheduleschema>;
   export type ReservationSchema = z.infer<typeof ReservationSchema>
    