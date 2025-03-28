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
      const product=searchParams.get('product')||'test'
      const state=searchParams.get('state')||'true'
    

      try {
        const apiResponse = await fetch(`${SERVER_URL}/${product}?page=${page}&state=${state}&limit=${limit}&fields=name,photo,user,cost,state,category`, {
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

 
export async function PUT(request: NextRequest) {
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
const apiResponse = await fetch(`${SERVER_URL}/admin/VerifyObject`, {
  method: 'PUT',
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
return NextResponse.json({ success: true, message: 'Approved', data });

} catch (error) {
console.error('Error:', error.message);

// Fallback error handling
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

  try {
const body = await request.json();
const apiResponse = await fetch(`${SERVER_URL}/admin/UnverifiedObject`, {
  method: 'DELETE',
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
return NextResponse.json({ success: true, message: 'Declined', data });

} catch (error) {
console.error('Error:', error.message);

// Fallback error handling
return NextResponse.json({
  success: false,
  message: error.message || 'An unexpected error occurred',
}, { status: 500 });
}
}     