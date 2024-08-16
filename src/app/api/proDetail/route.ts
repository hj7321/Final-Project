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

    const { data : reviewData, error : reviewError } = await supabase
      .from('Request Reviews')
      .select('*')
      .eq('request_post_id', id)

    if(reviewError) {
      throw reviewError
    }

    const reviewDataAndUser = await Promise.all(reviewData.map(async(review) => {
      const reviewUserId = review.user_id
      const { data : reviewUserData , error : reviewUserError} = await supabase
        .from('Users')
        .select('nickname')
        .eq('id', reviewUserId)
        .single()
        if(reviewUserError) {
          throw reviewError
        } else {
          return {...review, user : reviewUserData}
        }
    }))

    return NextResponse.json({ postData, userData, portfolioData, reviewData : reviewDataAndUser  });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: '데이터 가져오기 실패' }, { status: 500 });
  }
}
