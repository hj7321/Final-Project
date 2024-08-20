import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const info = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase.from('Portfolio').insert(info).select();
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '포트폴리오 등록에 실패했습니다.' });
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('Portfolio').select('*');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const info = await request.json();

    const supabase = createClient();
    const { data, error } = await supabase
      .from('Portfolio')
      .update({
        title: info.title,
        content: info.content,
        start_date: info.start_date,
        end_date: info.end_date,
        portfolio_img: info.portfolio_img // 이미지 URL 배열 추가
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

export async function DELETE(request: NextRequest) {
  try {
    const info = await request.json();

    const supabase = createClient();
    const { data, error } = await supabase.from('Portfolio').delete().eq('id', info.id);

    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '삭제에 실패했습니다.' });
  }
}
