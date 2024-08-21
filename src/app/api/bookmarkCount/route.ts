import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId');

  const { data, count, error } = await supabase
    .from('Bookmark')
    .select('posts_id', { count: 'exact', head: false })
    .eq('posts_id', postId!);

  if (error) {
    console.log('북마크 개수 GET 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data, count });
}
