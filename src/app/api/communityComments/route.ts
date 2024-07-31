import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const info = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase.from('Community Comments').insert(info).select();
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '댓글 등록에 실패했습니다.' });
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
//   } catch (error) {
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
