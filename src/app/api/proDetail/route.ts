import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  try {
    const supabase = createClient();

    const { data: postData, error: postError } = await supabase
      .from('Request Posts')
      .select('*')
      .eq('id', id)
      .single();

    if (postError) {
      throw postError;
    }

    const userId = postData.user_id;


    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      throw userError;
    }

    const { data : portfolioData, error : portfolioError } = await supabase
      .from('Portfolio')
      .select('*')
      .eq('user_id', userId)

    if ( portfolioError ) {
      throw portfolioError
    }

    return NextResponse.json({ postData, userData, portfolioData });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: '데이터 가져오기 실패' }, { status: 500 });
  }
}
