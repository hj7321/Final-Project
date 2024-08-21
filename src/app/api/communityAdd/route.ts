import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const info = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase.from('Community Posts').insert(info).select();
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '포트폴리오 등록에 실패했습니다.' });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const info = await request.json();

    const supabase = createClient();
    const { data, error } = await supabase
      .from('Community Posts')
      .update({
        title: info.title,
        content: info.content,
        post_category: info.post_category,
        lang_category: info.lang_category,
        post_img: info.post_img // 이미지 URL 배열 추가
      })
      .eq('id', info.id);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json({ error: '수정에 실패했습니다.' });
  }
}
