import { DayValue } from "@/schema/Essentials";
import { getToken, setUser } from "@/lib/auth";
import { ProfileValue } from "@/schema/Profile";

type productType = "test"| "medicine"
export const AcceptProduct = async (data:{id:string,type:productType})=>{
  const token = getToken();
  if (token){
    try {
      const response = await fetch(`/api/admin/product`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

     
      
      const res = await response.json();
  return res;
    } catch (error) {
      console.error('Error Accept:', error)
    }
  }
  else {
    console.error('No Token');
  }
}

export const SearchProducts = async (keyword:string,limit:number,page: number,product:productType,state:string) => {
  const token = getToken();
  if(token){
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    product,
    state,
    keyword,
  }).toString();
  const response = await fetch(`/api/admin/product/search?${queryParams}`, {
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
}
export const searchActors = async (keyword:string,limit:number,page: number,state:string,actor:string) => {
  const token = getToken();
  if(token){
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    state,
    keyword,
    actor
  }).toString();
  const response = await fetch(`/api/admin/actor/search?${queryParams}`, {
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

export const searchPatients = async (keyword:string,limit:number,page: number) => {
  const token = getToken();
  if(token){
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    keyword,
  }).toString();
  const response = await fetch(`/api/admin/patient/search?${queryParams}`, {
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

export const DeclineProduct = async (data:{id:string,type:productType})=>{
  const token = getToken();
 
  try {
    const response = await fetch(`/api/admin/product`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),

    })

  

const res = await response.json();
return res;
  } catch (error) {
    console.error('Error Decline:', error)
  }
} 

export const AcceptActor = async (data:{id:string})=>{
  const token = getToken();
  if (token){
    try {
      const response = await fetch(`/api/admin/actor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

     
      
      const res = await response.json();
  return res;
    } catch (error) {
      console.error('Error Accept:', error)
    }
  }
  else {
    console.error('No Token');
  }
}




export const DeclineActor = async (data:{id:string})=>{
  const token = getToken();
 
  try {
    const response = await fetch(`/api/admin/actor`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),

    })

  

const res = await response.json();
return res;
  } catch (error) {
    console.error('Error Decline:', error)
  }
} 

export const AddMedicine = async (formData:FormData)=>{
      const token = getToken();
      try {
        const response = await fetch(`/api/admin/product/medicine`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              
          },
          body: formData,
        })
  
      
  
    const res = await response.json();
    return res;
      } catch (error) {
        console.error('Error Add Medicine:', error)
      }
    }



    export const AddTest   = async (data:{name:string})=>{
      const token = getToken();
      try {
        const response = await fetch(`/api/admin/product/test`, {
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
        console.error('Error Add Test:', error)
      }
    }


    export const GetMyCart = async () => {
      const token = getToken();
      const response = await fetch(`/api/patient/cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache:"reload",
      });
      
      if (!response.ok) {
          throw new Error ('Failed to fetch Cart Data');
      }
      
      const res = await response.json();
      return res;
      }



      export const RemoveMedicineFromCart = async (id:string)=>{
        const token = getToken();
        const queryParams = new URLSearchParams({
          id,
          type:"medicine"
        }).toString();
        try {
          const response = await fetch(`/api/patient/cart?${queryParams}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json',
            },
          })
    
        
    
      const res = await response.json();
      return res;
        } catch (error) {
          console.error('Error Add Schedule:', error)
        }
      } 






      export const AddToCart   = async (data:{medicineId:string}|{testId:string})=>{
        const token = getToken();
        try {
          const response = await fetch(`/api/patient/cart`, {
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

      


      export const MedicineOnlinePayment = async (id:string)=>{
        const token = getToken();
        const queryParams = new URLSearchParams({
          id,
        }).toString();
        try {
          const response = await fetch(`/api/patient/cart/checkout/medicine?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json',
            },
          })
    
        
    
      const res = await response.json();
      return res;
        } catch (error) {
          console.error('Error Add Schedule:', error)
        }
      }  

      export const MedicineCashPayment   = async ()=>{
        const token = getToken();
        try {
          const response = await fetch(`/api/patient/cart/checkout/medicine`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
    
        
    
      const res = await response.json();
      return res;
        } catch (error) {
          console.error('Error Add Schedule:', error)
        }
      }

      export const TestOnlinePayment = async (reservationDate:string, id:string)=>{
        const token = getToken();
        const queryParams = new URLSearchParams({
          id,
          reservationDate,
        }).toString();
        try {
          const response = await fetch(`/api/patient/cart/checkout/test?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
          })
    
        
    
      const res = await response.json();
      return res;
        } catch (error) {
          console.log('Error Add Schedule:', error)
        }
      }  


      export const TestCashPayment   = async (data:{date:string})=>{
        const token = getToken();
        try {
          const response = await fetch(`/api/patient/cart/checkout/test`, {
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
    export const UpdateTest = async (data:{name:string},id:string)=>{
      const token = getToken();
      const queryParams = new URLSearchParams({
        id,
      }).toString();
      if (token){
        try {
          const response = await fetch(`/api/admin/product/test?${queryParams}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          })
    
          if (response.ok) {
          }
          
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

    export const UpdateMedicine = async (data:{name:string,category:string,cost:number},id:string)=>{
      const token = getToken();
      const queryParams = new URLSearchParams({
        id,
      }).toString();
      if (token){
        try {
          const response = await fetch(`/api/admin/product/medicine?${queryParams}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          })
    
          if (response.ok) {
          }
          
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


    export const UpdateProfile = async (formData:FormData)=>{
      const token = getToken();
      if (token){
        try {
          const response = await fetch(`/api/patient/updateProfile`, {
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
          const response = await fetch(`/api/patient/updateProfile/updatePassword`, {
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

    export const DeleteTest = async (id:string)=>{
      const token = getToken();
      const queryParams = new URLSearchParams({
        id,
      }).toString();
      try {
        const response = await fetch(`/api/lab/tests?${queryParams}`, {
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





export const RequestTest = async (data:{name:string})=>{
  const token = getToken();
  try {
    const response = await fetch(`/api/lab/tests/requestNew`, {
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

export const AddQuestion = async (data:{question:string,patient:string})=>{
  const token = getToken();
  try {
    const response = await fetch(`/api/medicalQuestions`, {
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
    console.error('Error Answer Question:', error)
  }
}

export const UpdateQuestion = async (data:{question:string},questionID:string)=>{
  const token = getToken();
  if (token){
    const queryParams = new URLSearchParams({
      questionID,
    }).toString();
    try {
      const response = await fetch(`/api/medicalQuestions?${queryParams}`, {
        method: 'PUT',
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


export const MarkCompleted = async (data:{state:string},RID:string)=>{
  const token = getToken();
  if (token){
    const queryParams = new URLSearchParams({
      RID,
    }).toString();
    try {
      const response = await fetch(`/api/lab/reservations?${queryParams}`, {
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
export const UpdateMyLabReservation = async (formData:FormData,id:string)=>{
  const token = getToken();
  if (token){
    const queryParams = new URLSearchParams({
      id,
    }).toString();
    try {
      const response = await fetch(`/api/patient/myActivity/labs?${queryParams}`, {
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


export const CancelLabReservation = async (id:string)=>{
  const token = getToken();
  const queryParams = new URLSearchParams({
    id,
  }).toString();
  try {
    const response = await fetch(`/api/patient/myActivity/labs?${queryParams}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json',
      },
    })

  

const res = await response.json();
console.log("res",res)
return res;
  } catch (error) {
    console.error('Error Add Schedule:', error)
  }
} 


export const CancelDoctorReservation = async (id:string)=>{
  const token = getToken();
  const queryParams = new URLSearchParams({
    id,
  }).toString();
  try {
    const response = await fetch(`/api/patient/myActivity/doctors?${queryParams}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json',
      },
    })

  

const res = await response.json();
console.log("res",res)
return res;
  } catch (error) {
    console.error('Error Add Schedule:', error)
  }
} 

export const UpdateMyDoctorReservation = async (formData:FormData,id:string)=>{
  const token = getToken();
  if (token){
    const queryParams = new URLSearchParams({
      id,
    }).toString();
    try {
      const response = await fetch(`/api/patient/myActivity/doctors?${queryParams}`, {
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

