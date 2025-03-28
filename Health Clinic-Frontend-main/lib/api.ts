import { FRONT_URL } from '@/schema/Essentials';
import { cookies } from 'next/headers'

export const getQuestions = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/medicalQuestions?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
          cache:"reload"
          
      });
    
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
    
      const res = await response.json();
      return res;
    } 

    export const Logout = async () => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      
      const response = await fetch(`${FRONT_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache:"no-cache",
      });
    
      if (!response.ok) {
            throw new Error ('Failed to fetch Doctors');
      }
    
      const res = await response.json();
      console.log(res)
      return res;
    }
    


    export const getOneQuestion = async (id:string) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        id
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/medicalQuestions/questionDetails?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache:"reload",
      });
    
      if (!response.ok) {
            throw new Error ('Failed to fetch questinos');
      }
    
      const res = await response.json();
      // (res);
      return res;
    } 
