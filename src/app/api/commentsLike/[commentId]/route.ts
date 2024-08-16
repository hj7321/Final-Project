import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { commentId: string } }) {
  const supabase = createClient();
  const { commentId } = params;
  const { data, count, error } = await supabase
    .from('Bookmark')
    .select('*', { count: 'exact', head: false })
    .eq('comment_id', commentId);
  if (error) {
    console.log('북마크 GET 에러: ', error.message);
    return Response.json({ errorMsg: error.message });
  } else return Response.json({ data, count });
}
