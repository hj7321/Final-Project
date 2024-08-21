import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.pathname.split('/').pop();

    if (!postId) {
      return NextResponse.json({ error: 'ID가 제공되지 않았습니다.' }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase.from('Community Posts').delete().eq('id', postId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    console.error('Error during deletion:', error);
    return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
  }
}
