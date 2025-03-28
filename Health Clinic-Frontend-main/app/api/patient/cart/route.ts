import { NextRequest, NextResponse } from 'next/server';
import { SERVER_URL } from '@/schema/Essentials';

const populateOptions="tests.labId=name profilePic address schedule,tests.purchasedTests.testId.test=name,medicines.pharmacyId=name profilePic address,medicines.purchasedMedicines.medicineId.medicine=name";


export async function GET(request: NextRequest) {
      const authHeader = request.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, message: 'Missing or invalid Authorization header' }, { status: 401 })
      }
      
      const token = authHeader.split(' ')[1];    
      if (!token) {
        return NextResponse.json({  success: false, message: 'Invalid token' }, { status: 401 })
      }

      // const searchParams = request.nextUrl.searchParams
      // const page = parseInt(searchParams.get('page') || '1',10)
      // const limit=parseInt(searchParams.get('limit')||'5',10);
      // const state=searchParams.get('state')||'true';
    

      try {
        const apiResponse = await fetch(`${SERVER_URL}/carts?limit=50000&populate=${populateOptions}`, {
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
          return NextResponse.json({ success: true, message: 'Cart Data', data });
      
        } catch (error) {
          console.error('Erroraaa:', error);
      
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
        const type = searchParams.get('type')||""
      console.log(id);
        try {
      const apiResponse = await fetch(`${SERVER_URL}/carts/${id}?type=${type}&populate=${populateOptions}`, {
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
      const data = await apiResponse.json();
      return NextResponse.json({ success: true, message: 'Test Deleted Successfully', data });
  
    } catch (error) {
      console.error('Error:', error.message);
  
      // Fallback error handling
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
  
      const apiResponse = await fetch(`${SERVER_URL}/carts?populate=${populateOptions}`, {
        method: 'POST',
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
      return NextResponse.json({ success: true, message: 'Item Added Successfully', data });
  
    } catch (error) {
      console.error('Error:', error.message);
  
      // Fallback error handling
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
    const id = searchParams.get('id')||"";
    const body = await request.json();
  
      try {
      const apiResponse = await fetch(`${SERVER_URL}/carts/${id}?populate=${populateOptions}`, {
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
      return NextResponse.json({ success: true, message: 'Quantity Updated Successfully', data });
      
    } catch (error) {
      console.error('Error:', error.message)
      return NextResponse.json({
        success: false,
        message: error.message || 'An unexpected error occurred',
      }, { status: 500 });
    }
  }