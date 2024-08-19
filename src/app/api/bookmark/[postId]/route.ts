import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const supabase = createClient();
  const { postId } = params;

  const { data, count, error } = await supabase
    .from('Bookmark')
    .select('*', { count: 'exact', head: false })
    .eq('posts_id', postId);

  if (error) {
    console.log('북마크 GET 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data, count });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { postId, userId } = await request.json();

  const { data, error } = await supabase.from('Bookmark').insert({ posts_id: postId, user_id: userId });

  if (error) {
    console.log('북마크 POST 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data });
}

export async function DELETE(request: Request) {
  const supabase = createClient();
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  console.log(userId);

  const { data, error } = await supabase.from('Bookmark').delete().eq('user_id', userId!);

  if (error) {
    console.log('북마크 DELETE 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else {
    return Response.json({ data });
  }
}
