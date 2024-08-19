import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const category = url.searchParams.get('category');

  const { data, error } = await supabase
    .from('Bookmark')
    .select('posts_id')
    .eq('user_id', userId!)
    .eq('post_category', category!);

  if (error) {
    console.log('북마크 마이페이지 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data });
}
