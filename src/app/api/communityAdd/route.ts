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
