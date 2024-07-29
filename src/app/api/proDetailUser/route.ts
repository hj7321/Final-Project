import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;

  // Posts 테이블에서 해당 게시물의 user_id를 가져오기
  const { data: postData, error: postError } = await supabase
    .from('Request Posts')
    .select('user_id')
    .eq('id', id)
    .single();

  if (postError) {
    return NextResponse.json({ error: postError.message }, { status: 500 });
  }

  const userId = postData.user_id;

  // Users 테이블에서 user_id로 유저 정보 가져오기
  const { data: userData, error: userError } = await supabase
    .from('Users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  return NextResponse.json(userData);
}
