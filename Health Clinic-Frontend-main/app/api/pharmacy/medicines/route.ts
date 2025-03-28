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
  try {
    const apiResponse = await fetch(`${SERVER_URL}/pharmacy/medicine?page=${page}&limit=${limit}&populate=medicine=name cost photo`, {
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
      return NextResponse.json({ success: true, message: 'My Tests Data', data });
  
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
      
      
          const apiResponse = await fetch(`${SERVER_URL}/pharmacy/medicine`, {
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
          return NextResponse.json({ success: true, message: 'Medicine Added Successfully', data });
      
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
            
        const body = await request.json();
      
          try {
          const apiResponse = await fetch(`${SERVER_URL}/questions/answer`, {
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
        const id = searchParams.get('id')||""
      console.log(id);
        try {
      const apiResponse = await fetch(`${SERVER_URL}/pharmacy/medicine/${id}`, {
        method: 'DELETE',
        headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json',
        },
         cache:"no-store"
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        return NextResponse.json({ success: false, message: errorData.message, error: errorData.errors }, { status: apiResponse.status });
      }
      console.log("errr")
  
      return NextResponse.json({ success: true, message: 'Medicine Deleted Successfully', data:"" });
  
    } catch (error) {
      console.error('Error:', error.message);
  
      // Fallback error handling
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
    const MID = searchParams.get('MID')||""   
    const body = await request.json();
  
      try {
      const apiResponse = await fetch(`${SERVER_URL}/pharmacy/medicine/${MID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.log(errorData)
        return NextResponse.json({ success: false, message: errorData.message, error: errorData.errors }, { status: apiResponse.status });
      }
  
      const data = await apiResponse.json();

      return NextResponse.json({ success: true, message: 'Medicine Stock Updated Successfully', data });
      
    } catch (error) {
      console.error('Error:', error.message);

      return NextResponse.json({
        success: false,
        message: error.message || 'An unexpected error occurred',
      }, { status: 500 });
    }
}