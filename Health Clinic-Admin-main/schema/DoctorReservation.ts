import * as z from "zod"




export const EndReservationSchema = z.object({
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

   export type EndReservationValues = z.infer<typeof EndReservationSchema>
    
    