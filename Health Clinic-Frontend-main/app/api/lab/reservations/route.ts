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
      const limit=parseInt(searchParams.get('limit')||'5',10);
      const state=searchParams.get('state')||'new';
      const startOfDay = searchParams.get('startOfDay')|| new Date().toISOString();
      const LastHourOfToday = searchParams.get('startOfDay')|| new Date().setHours(23, 59, 59, 999);
      const endOfDay= searchParams.get('endOfDay')||new Date(LastHourOfToday).toISOString();

      try {
        const apiResponse = await fetch(`${SERVER_URL}/lab/My-Reservations?page=${page}&limit=${limit}&date[gte]=${startOfDay}&date[lte]=${endOfDay}&populate=patient,requestedTests.testDetails.test=name&state=${state}`, {
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
          return NextResponse.json({ success: true, message: 'Lab Rservations Data', data });
      
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
        const RID=searchParams.get('RID');
        
        const body = await request.json();
      
          try {
          const apiResponse = await fetch(`${SERVER_URL}/lab-Reservation/${RID}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
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