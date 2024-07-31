import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const info = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase.from('Community Posts').insert(info).select();
    if (error) {
      return NextResponse.json(error);
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '게시물 등록에 실패했습니다.' });
  }
}
