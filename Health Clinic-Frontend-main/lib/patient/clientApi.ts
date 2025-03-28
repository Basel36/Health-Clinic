import { DayValue } from "@/schema/Essentials";
import { getToken, setUser } from "../auth";
import { ProfileValue } from "@/schema/Profile";

export const BookSession = async (data:{doctor:string,date:string})=>{
      const token = getToken();
      try {
        const response = await fetch(`/api/patient/doctors/oneDoctor`, {
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

export const SearchLabTests = async (id:string,keyword:string,page:number,limit:number) => {
  const token = getToken();

  const queryParams = new URLSearchParams({
    id,
    keyword,
    limit: limit.toString(),
    page: page.toString(),
  }).toString();
  const response = await fetch(`/api/patient/labs/oneLab/test/search?${queryParams}`, {
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

    
export const SearchPharmacyMedicine = async (id:string,keyword:string,page:number,limit:number) => {
  const token = getToken();
  const queryParams = new URLSearchParams({
  id,
  keyword,
  page: page.toString(),
  limit: limit.toString(),
  }).toString();
  const response = await fetch(`/api/patient/pharmacies/onePharmacy/medicine/search?${queryParams}`, {
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


      export const RemoveTestFromCart = async (id:string)=>{
        const token = getToken();
        const queryParams = new URLSearchParams({
          id,
          type:"test"
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

      

      export const updateMedicineQuantity = async (data:{type:string,quantity:number},id:string)=>{
        const token = getToken();
        if (token){
          const queryParams = new URLSearchParams({
            id,
          }).toString();
          try {
            const response = await fetch(`/api/patient/cart?${queryParams}`, {
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

      export const TestOnlinePayment   = async (id:string,data:{data:{labId:string,date:string}})=>{
        const token = getToken();
        const queryParams = new URLSearchParams({
          id,
        }).toString();
        try {
          const response = await fetch(`/api/patient/cart/checkout/test/online?${queryParams}`, {
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

      export const DoctorOnlinePayment = async ( id:string,reservationDate:string)=>{
        const token = getToken();
        const queryParams = new URLSearchParams({
          id,
          reservationDate,
        }).toString();
        try {
          const response = await fetch(`/api/patient/cart/checkout/doctor?${queryParams}`, {
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

      export const TestCashPayment   = async (data:{data:{labId:string,date:string}})=>{
        const token = getToken();
        try {
          const response = await fetch(`/api/patient/cart/checkout/test/cash`, {
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



export const AddTest = async (data:{Lab:string,test:string,preparations:string[],cost:string})=>{
  const token = getToken();
  try {
    const response = await fetch(`/api/lab/tests`, {
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


export const DeleteQuestion = async (id:string)=>{
  const token = getToken();
  const queryParams = new URLSearchParams({
    id,
  }).toString();
  try {
    const response = await fetch(`/api/medicalQuestions?${queryParams}`, {
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
export const UpdateMyLabReservation = async (data:{date:string},id:string)=>{
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


export const SearchForTest = async (keyword:string,page:number) => {

  const token = getToken();
  if(token){
    const queryParams = new URLSearchParams({
      keyword,
      page:page.toString()||`1`
    }).toString();
    const response = await fetch(`/api/patient/search/tests?${queryParams}`, {
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

export const SearchForLab = async (keyword:string,page:number) => {

  const token = getToken();
  if(token){
    const queryParams = new URLSearchParams({
      keyword,
      page:page.toString()||`1`
    }).toString();
    const response = await fetch(`/api/patient/search/labs?${queryParams}`, {
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
export const SearchForPharmacy = async (keyword:string,page:number) => {

  const token = getToken();
  if(token){
    const queryParams = new URLSearchParams({
      keyword,
      page:page.toString()||`1`
    }).toString();
    const response = await fetch(`/api/patient/search/pharmacy?${queryParams}`, {
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

export const SearchForMedicine = async (keyword:string,page:number) => {

  const token = getToken();
  if(token){
    const queryParams = new URLSearchParams({
      keyword,
      page:page.toString()||`1`
    }).toString();
    const response = await fetch(`/api/patient/search/medicines?${queryParams}`, {
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


export const SearchForActor = async (keyword:string,actor:string,page:number) => {

  const token = getToken();
  if(token){
    const queryParams = new URLSearchParams({
      keyword,
      actor,
      page:page.toString()||`1`
    }).toString();
    const response = await fetch(`/api/patient/search/actors?${queryParams}`, {
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

export const UseModel = async (data:{symptoms:string[]})=>{
  const token = getToken();
  try {
    const response = await fetch(`/api/model`, {
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
