import { ImageHandler } from "@/utils/AuthHandlers"
import * as z from "zod"

export const DoctorProfileSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters").regex(
        /^[a-zA-Z0-9\s]*$/,
        "Name can only contain letters, numbers, and spaces"
      ),
      email: z.string().email("Invalid email address"),
      about: z.string().min(5,"About must be at least 5 characters"),
      gender: z.enum(["male", "female"]),
      dateOfBirth: z.date(),
      specialization: z.string(),
      phoneNumbers: z.array(z.string().min(1, "Phone number is required")),
      address: z.array(z.string().min(1, "Address is required")),
      profilePic: z.union([z.string(), z.custom<File>(ImageHandler, {
            message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
          })]).nullish(),
      license: z.array(z.union([z.string(), z.custom<File>(ImageHandler, {
            message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
          })])),
    })
    
    export const LabProfileSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters").regex(
      /^[a-zA-Z0-9\s]*$/,
      "Name can only contain letters, numbers, and spaces"
    ),
      email: z.string().email("Invalid email address"),
      phoneNumbers: z.array(z.string().min(1, "Phone number is required")),
      address: z.array(z.string().min(1, "Address is required")),
      profilePic: z.union([z.string(), z.custom<File>(ImageHandler, {
            message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
          })]).nullish(),
      license: z.array(z.union([z.string(), z.custom<File>(ImageHandler, {
            message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
          })])),
    })

    export const PatientProfileSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters").regex(
        /^[a-zA-Z0-9\s]*$/,
        "Name can only contain letters, numbers, and spaces"
      ),
      email: z.string().email("Invalid email address"),
      gender: z.enum(["male", "female"]),
      dateOfBirth: z.date(),
      phoneNumbers: z.array(z.string().min(1, "Phone number is required")),
      address: z.array(z.string().min(1, "Address is required")),
      profilePic: z.union([z.string(), z.custom<File>(ImageHandler, {
            message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
          })]).nullish(),
  
    })

    export const PasswordSchema = z.object({
     
      currentPassword: z.string().min(6, "password_8chars"),
      newPassword: z.string().min(6, "password_8chars"),
      passwordConfirm: z.string().min(6, "password_8chars"),
    }).refine((data) => data.newPassword === data.passwordConfirm, {
      message: "password_not_match",
      path: ["passwordConfirm"],
    });
    type DoctorProfileValue = z.infer<typeof DoctorProfileSchema>
    type PateintProfileValue = z.infer<typeof PatientProfileSchema>
    type LabProfileValue = z.infer<typeof LabProfileSchema>
    export type ProfileValue= DoctorProfileValue|PateintProfileValue|LabProfileValue;
    export type PasswordValue = z.infer<typeof PasswordSchema>