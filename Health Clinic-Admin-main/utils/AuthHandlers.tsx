import { removeUser } from "@/lib/auth";
import { Accounts, ISignUpData } from "@/schema/Essentials";
import { ProfileValue } from "@/schema/Profile";
import { sessionCostValue } from "@/schema/Schedule";

const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const ImageHandler = (file:File) => {
      if (!file) return false;
      // Check file type
      if (!acceptedImageTypes.includes(file.type)) {
        return false;
      }
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return false;
      }
      return true;
    };
    export const FormDataHandler = (data: Accounts | sessionCostValue | ProfileValue) => {
      const formData = new FormData();
    
      const appendToFormData = (obj: any, prefix = '') => {
        if (obj instanceof File) {
          formData.append(prefix, obj);
        } else if (Array.isArray(obj)) {
          if ( obj.every(item => item instanceof File)) {
            // For license or any array where all items are Files, append as is
            obj.forEach(item => {
              formData.append(`${prefix}`, item);
            });
          } else {
            // For other arrays, process each item individually
            obj.forEach((item, index) => {
              appendToFormData(item, `${prefix}[${index}]`);
            });
          }
          
             } 
             else if (obj instanceof Date) {
              formData.append(prefix, obj.toISOString());
            } else if (typeof obj === 'object' && obj !== null) {
          Object.entries(obj).forEach(([key, value]) => {
            const newPrefix = prefix ? `${prefix}[${key}]` : key;
            appendToFormData(value, newPrefix);
          });
        } else {
          formData.append(prefix, obj);
        }
      };
    
      appendToFormData(data);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      return formData;
    };
  
   
    export const onSignupSubmit = async (formData:FormData) => {
     
      try {
        // Send the form data via fetch
        const response = await fetch('/api/signup', {
          method: 'POST',
          body: formData,
        });
    
        const result = await response.json();
        return result
      } catch (error) {
        console.error('Error:', error);
      }
    };

    export const LoginSubmit = async (Actor:Accounts) => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify(Actor), 
        });
    
        const result = await response.json();
        return result
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
   