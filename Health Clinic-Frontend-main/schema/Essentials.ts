import * as z from "zod"
import { DoctorScheduleschemaValue, DoctorValue } from "./Doctor";
import { PatientValue } from "./Patient";
import { LabValue } from "./Lab";
import { PharmacyValue } from "./Pharmacy";

type Doctor={DoctorValue:DoctorValue,role:string,schedule:DoctorScheduleschemaValue}
export type Accounts = PatientValue| DoctorValue| LabValue | PharmacyValue
export interface ISignUpData {
  data: Accounts;

}

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
    

   export  const SERVER_URL = process.env.AUTH_SERVER_URL || 'https://clinic-square-apis.onrender.com/api/v1';
 export const FRONT_URL= "https://clinic-square-frontend.vercel.app" 
//export const FRONT_URL= "http://localhost:3000" 
export const MODEL_URL="https://clinic-square-model.onrender.com"
export const Doctors_Specializations=['Allergist','Cardiologist','Dermatologist','Endocrinologist','Gastroenterologist','Gynecologist','Hepatologist','Internal Medcine','Neurologist','Osteopathic','Otolaryngologist','Pediatrician','Phlebologist','Pulmonologist','Rheumatologists','Tuberculosis']
    export const DaySchema = z.object({
      day: z.enum(DaysOfWeek  ,{  errorMap: () => ({ message: "You have to choose day" }),}),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,  "Please Enter Start Time"),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please Enter End Time"),
      limit: z.coerce.number().int().positive(),
    });
    


    
    export const HandleTimeFormat=(timestamp:string)=> {
    
      const date = new Date(timestamp);

      // Function to format time into 12-hour format
      const formatTimeTo12Hour = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        hours = hours % 12;
        hours = hours ? hours : 12; // If hour is 0, make it 12 (midnight or noon)
    
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')} ${ampm}`;
        return formattedTime;
      };
    
     return formatTimeTo12Hour(date);
    
    }
    export const ConvertTimeToDate=(time:string)=>{
      const [hours, minutes] = time.split(":").map(Number);
      let Time=new Date()
      Time.setHours(hours);
      Time.setMinutes(minutes);
      return Time.toISOString();
    }
    // Export the schema for use in your form


    export type userTypeValue =z.infer<typeof userTypeSchema>;
    export type DayValue =z.infer<typeof DaySchema>;
    
    
