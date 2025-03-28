import { FRONT_URL } from '@/schema/Essentials'
import { cookies } from 'next/headers'
type actor= "patient" | "pharmacy" | "lab" | "doctor" 
type product= "medicines" | "tests"  
export const getAllDoctors = async (limit:number,page: number) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/patient/doctors?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
  }

  const res = await response.json();
  return res;
}



export const getAllReservations = async (limit:number,page: number,actor:actor) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    actor: `${actor}-Reservation`
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/reservations?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
  }

  const res = await response.json();
  return res;
}

export const getAllOrders = async (limit:number,page: number) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/orders?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
  }

  const res = await response.json();
  return res;
}



export const getAllActorData = async (limit:number,page: number,actor:actor,state:string) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    actor,
    state
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/actor?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
  }

  const res = await response.json();
  return res;
}



export const getAllActorStats = async (limit:number,page: number,actor:actor) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    actor,
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/actor/stats?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
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
export const getPatientStats = async (limit:number,page: number) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/patient/stats?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
  }

  const res = await response.json();
  return res;
} 

export const getAllReservationsStats = async (limit:number,page: number,actor:actor) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    actor: `${actor}-Reservation`
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/reservations/stats?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
  }

  const res = await response.json();
  return res;
}

export const getAllOrdersStats = async (limit:number,page: number) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/orders/stats?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
  }

  const res = await response.json();
  return res;
}


export const getAllPatientsData = async (limit:number,page: number) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/patient?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
  }

  const res = await response.json();
  return res;
}

export const getAllProductData = async (limit:number,page: number,product:product,state:string) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    product,
    state
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/admin/product?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache:"reload",
  });

  if (!response.ok) {
        throw new Error ('Failed to fetch Doctors');
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
