import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id, commentData, userId } = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Community Comments')
      .insert({ contents: commentData, community_post_id: id, user_id: userId })
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '댓글 등록에 실패했습니다.' });
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('Community Comments').select('*');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' });
  }
}

// export async function PUT(request: NextRequest) {
//   try {
//     const info = await request.json();
//     const supabase = createClient();
//     const { data, error } = await supabase
//       .from('Community Comments')
//       .update({ content: info.content })
//       .eq('id', info.id);
//     return NextResponse.json(data);
//   } catch ( error) {
//     return NextResponse.json({ error: '수정에 실패했습니다.' });
//   }
// }

export async function DELETE(request: NextRequest) {
  try {
    const info = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase.from('Community Comments').delete().eq('id', info);
    if (error) {
      return alert(`${error.message}`);
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '삭제에 실패했습니다.' });
  }
}
