import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { commentId: string } }) {
  const supabase = createClient();
  const { commentId } = params;

  const { data, count, error } = await supabase
    .from('Community Likes')
    .select('*', { count: 'exact', head: false })
    .eq('comment_id', commentId);
  if (error) {
    console.log('GET 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data, count });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { commentId, userId } = await request.json();

  const { data, error } = await supabase.from('Community Likes').insert({ comment_id: commentId, user_id: userId });

  if (error) {
    console.log('POST 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data });
}

export async function DELETE(request: Request, { params }: { params: { commentId: string } }) {
  const supabase = createClient();

  const { commentId } = params;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  const { data, error } = await supabase
    .from('Community Likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', userId!);

  if (error) {
    console.log('DELETE 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data });
}
