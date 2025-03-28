import * as z from "zod"

import { ImageHandler } from "@/utils/AuthHandlers";


    export const PharmacySchema = z.object({
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
 
    export const MedicineSchema = z.object({
      id: z.string().min(5, {
        message: "Medicine name must be at least 5 characters.",
      }),
      stock: z.string().refine((val:string) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Stock must be a positive number.",
      }),
 
     
    })
    export const NewMedicineSchema = z.object({
      name: z.string().min(5, {
        message: "Medicine name must be at least 5 characters.",
      }),
      cost: z.string().refine((val:string) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Stock must be a positive number.",
      }),
      photo:z.custom<File>(ImageHandler, {
        message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
      }),
     
    })
    
   export type MedicineValue = z.infer<typeof MedicineSchema>;
   export type NewMedicineValue = z.infer<typeof NewMedicineSchema>;
    
    // Export the schema for use in your form

    export type PharmacyValue =z.infer<typeof PharmacySchema>;
    