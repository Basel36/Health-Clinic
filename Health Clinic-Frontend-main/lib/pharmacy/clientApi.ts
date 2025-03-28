import { DayValue } from "@/schema/Essentials";
import { getToken, setUser } from "../auth";
import { ProfileValue } from "@/schema/Profile";


export const searchOrders = async (keyword:string,limit:number,page: number,state:string) => {
  const token = getToken();
  if(token){
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    state,
    keyword,
  }).toString();
  const response = await fetch(`/api/pharmacy/search/orders?${queryParams}`, {
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
}

export const searchMedicines = async (keyword:string,limit:number,page: number) => {
  const token = getToken();
  if(token){
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    keyword,
  }).toString();
  const response = await fetch(`/api/pharmacy/search/medicines?${queryParams}`, {
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
}

export const addDay = async (data)=>{
      const token = getToken();
      try {
        const response = await fetch(`/api/lab/schedule/day`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
  
      
  
    const res = await response.json();
    return res;
      } catch (error) {
        console.error('Error Add Schedule:', error)
      }
    }



    export const UpdateDay = async (day:DayValue)=>{
      const token = getToken();
      try {
        const response = await fetch(`/api/lab/schedule/day`, {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(day),
        })
  
      
  
    const res = await response.json();
    return res;
      } catch (error) {
        console.error('Error Add Schedule:', error)
      }
    } 

    export const DeleteDay = async (day:DayValue)=>{
      const token = getToken();
      try {
        const response = await fetch(`/api/lab/schedule/day`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(day),
        })
  
      
  
    const res = await response.json();
    return res;
      } catch (error) {
        console.error('Error Add Schedule:', error)
      }
    } 

    export const UpdateProfile = async (formData:FormData)=>{
      const token = getToken();
      if (token){
        try {
          const response = await fetch(`/api/pharmacy/updateProfile`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
          })
    
          if (response.ok) {
          }
          
          const res = await response.json();
          setUser(res.data.data,token);
      return res;
        } catch (error) {
          console.error('Error Add Schedule:', error)
        }
      }
      else {
        console.error('No Token');
      }
    }

    export const UpdatePassword = async (data:ProfileValue)=>{
      const token = getToken();
      if (token){
        try {
          const response = await fetch(`/api/pharmacy/updateProfile`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          })
    
         
          
          const res = await response.json();
      return res;
        } catch (error) {
          console.error('Error Add Schedule:', error)
        }
      }
      else {
        console.error('No Token');
      }
    }

    export const SearchReservation = async (patient:string) => {

      const token = getToken();
      if(token){
        const queryParams = new URLSearchParams({
          patient: patient,
        }).toString();
        const response = await fetch(`/api/lab/reservations?${queryParams}`, {
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

    export const DeleteMedicine = async (id:string)=>{
      const token = getToken();
      const queryParams = new URLSearchParams({
        id,
      }).toString();
      try {
        const response = await fetch(`/api/pharmacy/medicines?${queryParams}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
              // 'Content-Type': 'application/json',
          },
           cache:"no-store"
        })
  
      
  
    const res = await response.json();
    console.log("res",res)
    return res;
      } catch (error) {
        console.error('Error Add Schedule:', error)
      }
    } 



export const AddMedicine = async (data:{medicine:string,stock:string})=>{
  const token = getToken();
  try {
    const response = await fetch(`/api/pharmacy/medicines`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

  

const res = await response.json();
return res;
  } catch (error) {
    console.error('Error Add Schedule:', error)
  }
}

export const UpdateStock = async (data:{stock:string},MID:string)=>{
  const token = getToken();
  if (token){
    const queryParams = new URLSearchParams({
      MID,
    }).toString();
    try {
      const response = await fetch(`/api/pharmacy/medicines?${queryParams}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })

      if (response.ok) {
      }
      
      const res = await response.json();
  return res;
    } catch (error) {
      console.error('Error Upload Test:', error)
    }
  }
  else {
    console.error('No Token');
  }
}


export const RequestMedicine = async (data:FormData)=>{
  const token = getToken();
  try {
    const response = await fetch(`/api/pharmacy/medicines/requestNew`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
      },
      body: data,
    })

  

const res = await response.json();
return res;
  } catch (error) {
    console.error('Error Add Schedule:', error)
  }
}




export const UploadResults = async (formData:FormData,RID:string)=>{
  const token = getToken();
  if (token){
    const queryParams = new URLSearchParams({
      RID,
    }).toString();
    try {
      const response = await fetch(`/api/lab/tests?${queryParams}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
      }
      
      const res = await response.json();
  return res;
    } catch (error) {
      console.error('Error Upload Test:', error)
    }
  }
  else {
    console.error('No Token');
  }
}


export const MarkDelivered = async (data:{state:string},OID:string)=>{
  const token = getToken();
  if (token){
    const queryParams = new URLSearchParams({
      OID,
    }).toString();
    try {
      const response = await fetch(`/api/pharmacy/orders?${queryParams}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      })

      if (response.ok) {
      }
      
      const res = await response.json();
  return res;
    } catch (error) {
      console.error('Error Upload Test:', error)
    }
  }
  else {
    console.error('No Token');
  }
}