import { NextRequest, NextResponse } from 'next/server';
import { SERVER_URL } from '@/schema/Essentials';




export async function GET(request: NextRequest) {
      const authHeader = request.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, message: 'Missing or invalid Authorization header' }, { status: 401 })
      }
      
      const token = authHeader.split(' ')[1];    
      if (!token) {
        return NextResponse.json({  success: false, message: 'Invalid token' }, { status: 401 })
      }

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get('page') || '1',10)
      const limit=parseInt(searchParams.get('limit')||'7',10);
    console.log("hnaaaaaa")

      try {
        const apiResponse = await fetch(`${SERVER_URL}/patient/Patient-reservation?page=${page}&limit=${limit}&populate=doctor=name profilePic specialization schedule gender `, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
    
        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.log(errorData)
            return NextResponse.json({ success: false, message: errorData.message }, { status: apiResponse.status });
          }
      
          const data = await apiResponse.json();
          return NextResponse.json({ success: true, message: 'My Doctors Reservations Data', data });
      
        } catch (error) {
          console.error('Erroraaa:', error);
      
          return NextResponse.json({
            success: false,
            message: error.message || 'An unexpected error occurred',
          }, { status: 500 });
        }
      }
      
      export async function PATCH(request: NextRequest) {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json({ success: false, message: 'Missing or invalid Authorization header' }, { status: 401 })
        }
        
        const token = authHeader.split(' ')[1];    
        if (!token) {
          return NextResponse.json({  success: false, message: 'Invalid token' }, { status: 401 })
        }
       
        const searchParams = request.nextUrl.searchParams
        const id=searchParams.get('id');
        
        const body = await request.formData();
      
          try {
          const apiResponse = await fetch(`${SERVER_URL}/doctor-Reservation/${id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: body,
          });
      
          if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.log(errorData)
            return NextResponse.json({ success: false, message: errorData.message, error: errorData.errors }, { status: apiResponse.status });
          }
      
          const data = await apiResponse.json();

          return NextResponse.json({ success: true, message: 'Update successful', data });
          
        } catch (error) {
          console.error('Error:', error.message);
  
          return NextResponse.json({
            success: false,
            message: error.message || 'An unexpected error occurred',
          }, { status: 500 });
        }
      }


     
      export async function DELETE(request: NextRequest) {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json({ success: false, message: 'Missing or invalid Authorization header' }, { status: 401 })
        }
        
        const token = authHeader.split(' ')[1];    
        if (!token) {
          return NextResponse.json({  success: false, message: 'Invalid token' }, { status: 401 })
        }
        const searchParams = request.nextUrl.searchParams
        const id = searchParams.get('id')||""
        try {
      const apiResponse = await fetch(`${SERVER_URL}/doctor-Reservation/${id}`, {
        method: 'DELETE',
        headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json',
        },
         
      });
      
      if (!apiResponse.ok) {
        console.log("errr")
        const errorData = await apiResponse.json();
        return NextResponse.json({ success: false, message: errorData.message, error: errorData.errors }, { status: apiResponse.status });
      }
      // const data = await apiResponse.json();
      return NextResponse.json({ success: true, message: 'Reservation Canceled Successfully' });
  
    } catch (error) {
      console.error('Error:', error.message);
  
      // Fallback error handling
      return NextResponse.json({
        success: false,
        message: error.message || 'An unexpected error occurred',
      }, { status: 500 });
    }
  } 