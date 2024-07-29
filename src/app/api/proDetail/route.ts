// import { createClient } from "@/utils/supabase/client";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get('id');

//   if (!id) {
//     return NextResponse.json({ error: 'ID is required' }, { status: 400 });
//   }

//   try {
//     const supabase = createClient();
//     const { data, error } = await supabase
//       .from('Request Posts')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) {
//       throw error;
//     }

//     console.log('데이터 가져옴');
//     return NextResponse.json({ data });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return NextResponse.json({ error: '데이터 가져오기 실패' }, { status: 500 });
//   }
// }

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

    // 게시물 정보 가져오기
    const { data: postData, error: postError } = await supabase
      .from('Request Posts')
      .select('*')
      .eq('id', id)
      .single();

    if (postError) {
      throw postError;
    }

    const userId = postData.user_id;

    // 유저 정보 가져오기
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      throw userError;
    }

    // 게시물 정보와 유저 정보를 함께 반환
    return NextResponse.json({ postData, userData });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: '데이터 가져오기 실패' }, { status: 500 });
  }
}
