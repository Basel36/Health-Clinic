import { SERVER_URL } from '@/schema/Essentials';
import { NextRequest, NextResponse } from 'next/server';





export async function POST(request: NextRequest) {
  try {
   
    const formData = await request.formData();

    const apiResponse = await fetch(`${SERVER_URL}/auth/signUp`, {
      method: 'POST',
      body:formData  
    });


    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.log(errorData)
      return NextResponse.json({ success: false, message: errorData.message }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return NextResponse.json({ success: true, message: 'SignUp successful', data });

  } catch (error) {
    console.error('Error:', error);

    // Fallback error handling
    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred',
    }, { status: 500 });
  }
}
