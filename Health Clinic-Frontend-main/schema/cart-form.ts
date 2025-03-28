import * as z from "zod"

export const labScheduleSchema = z.object({
  labId: z.string(),
  selectedDay: z.string().min(1, "Please select a day"),
  selectedDate: z.string().min(1, "Please select a date")
})

export const cartFormSchema = z.object({
  labSchedules: z.array(labScheduleSchema),
  paymentMethod: z.enum(["cash", "visa"])
})

export type LabSchedule = z.infer<typeof labScheduleSchema>
export type CartFormData = z.infer<typeof cartFormSchema>

