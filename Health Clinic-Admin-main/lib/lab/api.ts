import { FRONT_URL } from '@/schema/Essentials';
import { cookies } from 'next/headers'

export const getReservationsHistory = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        date: new Date().toISOString(),
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/lab/reservationsHistory?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache:"reload",
      });
    
      if (!response.ok) {
            throw new Error ('Failed to fetch reservations');
      }
    
      const res = await response.json();
      return res;
    }

    
  export const getReservations = async (limit:number,page: number, startOfDay: string,endOfDay:string,state:string) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        startOfDay,
        endOfDay,
        state,
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/lab/reservations?${queryParams}`, {
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
      console.log(res)
      return res;
    } 

    export const getSchedule = async () => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const response = await fetch(`${FRONT_URL}/api/lab/schedule`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache:"reload",
      });
    
      if (!response.ok) {
            throw new Error ('Failed to fetch reservations');
      }
    
      const res = await response.json();
      return res;
    } 


    export const getAvaliableTests = async () => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const response = await fetch(`${FRONT_URL}/api/lab/tests/available`, {
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

    



    export const getMyTests = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/lab/tests?${queryParams}`, {
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
