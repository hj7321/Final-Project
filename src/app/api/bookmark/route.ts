import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { postId, userId } = await request.json();

  const { data, error } = await supabase.from('Bookmark').insert({ posts_id: postId, user_id: userId });

  if (error) {
    console.log('북마크 POST 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data });
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { postId } = await request.json();

  const { data, error } = await supabase.from('Bookmark').select('*').eq('id', postId);

  if (error) {
    console.log('북마크 GET 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data });
}
