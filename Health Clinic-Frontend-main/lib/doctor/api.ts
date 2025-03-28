import { FRONT_URL } from '@/schema/Essentials';
import { cookies } from 'next/headers'

export const getReservationsHistory = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/doctor/reservationsHistory?${queryParams}`, {
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

    
  export const getReservations = async (limit:number,page: number, startOfDay: string,endOfDay:string) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        startOfDay,
        endOfDay,
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/doctor/reservations?${queryParams}`, {
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
    
    export const getReservationsStat = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/doctor/reservations/stat?${queryParams}`, {
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

    export const getSchedule = async () => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const response = await fetch(`${FRONT_URL}/api/doctor/schedule`, {
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
