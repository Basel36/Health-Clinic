  import { FRONT_URL } from '@/schema/Essentials';
import { cookies } from 'next/headers'

export const getAllDoctors = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        state: "true"
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

export const SearchForActor = async (keyword:string,actor:string,page:number) => {

  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  if(token){
    const queryParams = new URLSearchParams({
      keyword,
      actor,
      page:page.toString()||`1`
    }).toString();
    const response = await fetch(`${FRONT_URL}/api/patient/search/actors?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
        cache:"no-store"
        
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch reservations');
    }
  
    const res = await response.json();
    return res;
  }
     else {
    console.error('No Token');
  }

} 


    export const getMyDoctorsResrvations = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/patient/myActivity/doctors?${queryParams}`, {
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


    export const getMyPharmaciesResrvations = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/patient/myActivity/pharmacies?${queryParams}`, {
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
    export const getMyLabsResrvations = async (limit:number,page: number) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/patient/myActivity/labs?${queryParams}`, {
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

    export const getOneDoctor = async (id:string) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        id,
        state: "true"
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/patient/doctors/oneDoctor?${queryParams}`, {
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


    export const getOneLab = async (id:string) => {
      const cookieStore = cookies()
      const token = JSON.parse (cookieStore.get('token').value)
      const queryParams = new URLSearchParams({
        id,
        state: "true"
      }).toString();
      const response = await fetch(`${FRONT_URL}/api/patient/labs/oneLab?${queryParams}`, {
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

export const getAllLabs = async (limit:number,page: number) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    state: "true"
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/patient/labs?${queryParams}`, {
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

    
export const GetLabTests = async (id:string,page:number,limit:number) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    id,
    limit: limit.toString(),
    page: page.toString(),
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/patient/labs/oneLab/test?${queryParams}`, {
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


export const getAllPharmacies = async (limit:number,page: number) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    state: "true"
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/patient/pharmacies?${queryParams}`, {
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
   


export const getOnePharmacy = async (id:string) => {
  const cookieStore = cookies()
  const token = JSON.parse (cookieStore.get('token').value)
  const queryParams = new URLSearchParams({
    id,
    state: "true"
  }).toString();
  const response = await fetch(`${FRONT_URL}/api/patient/pharmacies/onePharmacy?${queryParams}`, {
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



  


export const GetPharmacyMedicine = async (id:string,page:number,limit:number) => {
const cookieStore = cookies()
const token = JSON.parse (cookieStore.get('token').value)
const queryParams = new URLSearchParams({
  id,
  limit: limit.toString(),
  page: page.toString(),
}).toString();
const response = await fetch(`${FRONT_URL}/api/patient/pharmacies/onePharmacy/medicine?${queryParams}`, {
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

