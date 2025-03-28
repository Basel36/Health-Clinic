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

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1',10);
  const limit=parseInt(searchParams.get('limit')||'5',10);
  try {
    const apiResponse = await fetch(`${SERVER_URL}/questions?populate=patient=name dateOfBirth profilePic gender,answers.doctor=name profilePic specialization&page=${page}&limit=${limit}`, {
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
      return NextResponse.json({ success: true, message: 'Questions Data', data });
  
    } catch (error) {
      console.error('Erroraaa:', error);
  
      return NextResponse.json({
        success: false,
        message: error.message || 'An unexpected error occurred',
      }, { status: 500 });
    }
  }
  



      export async function POST(request: NextRequest) {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json({ success: false, message: 'Missing or invalid Authorization header' }, { status: 401 })
        }
        
        const token = authHeader.split(' ')[1];    
        if (!token) {
          return NextResponse.json({  success: false, message: 'Invalid token' }, { status: 401 })
        }
  
        try {
          const body = await request.json();
      
      
          const apiResponse = await fetch(`${SERVER_URL}/questions`, {
            method: 'POST',
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
          return NextResponse.json({ success: true, message: 'Question Added, Thanks', data });
      
        } catch (error) {
          console.error('Error:', error.message);
      
          return NextResponse.json({
            success: false,
            message: error.message || 'An unexpected error occurred',
          }, { status: 500 });
        }
      }

      export async function PUT(request: NextRequest) {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json({ success: false, message: 'Missing or invalid Authorization header' }, { status: 401 })
        }
        
        const token = authHeader.split(' ')[1];    
        if (!token) {
          return NextResponse.json({  success: false, message: 'Invalid token' }, { status: 401 })
        }
        const searchParams = request.nextUrl.searchParams
        const questionID = searchParams.get('questionID')||"";
        const body = await request.json();
      
          try {
          const apiResponse = await fetch(`${SERVER_URL}/questions/${questionID}`, {
            method: 'PUT',
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
      
          const data = await apiResponse.json()
          return NextResponse.json({ success: true, message: 'Answer Updated Successfully', data });
          
        } catch (error) {
          console.error('Error:', error.message)
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
        const id = searchParams.get('id')||"";
        try {
      const apiResponse = await fetch(`${SERVER_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json',
        },
      });
  
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.log(errorData)
        return NextResponse.json({ success: false, message: errorData.message, error: errorData.errors }, { status: apiResponse.status });
      }
  
      // const data = await apiResponse.json();
      return NextResponse.json({ success: true, message: 'Question Deleted Successfully'});
  
    } catch (error) {
      console.error('Error:', error.message);
  
      // Fallback error handling
      return NextResponse.json({
        success: false,
        message: error.message || 'An unexpected error occurred',
      }, { status: 500 });
    }
  }