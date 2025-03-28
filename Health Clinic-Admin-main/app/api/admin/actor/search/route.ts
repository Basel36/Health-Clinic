import { SERVER_URL } from '@/schema/Essentials';
import { NextRequest, NextResponse } from 'next/server';


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
      const actor=searchParams.get('actor')||'doctor'
      const state=searchParams.get('state')||'true'
      const keyword=searchParams.get('keyword')||''
    

      try {
        const apiResponse = await fetch(`${SERVER_URL}/${actor}?page=${page}&limit=${limit}&state=${state}&fields=name,specialization,profilePic,address,email,phoneNumbers,about,gender,license,dateOfBirth,role,state&keyword=${keyword}`, {
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
          return NextResponse.json({ success: true, message: 'Doctors Data', data });
      
        } catch (error) {
          console.error('Erroraaa:', error);
      
          return NextResponse.json({
            success: false,
            message: error.message || 'An unexpected error occurred',
          }, { status: 500 });
        }
      }