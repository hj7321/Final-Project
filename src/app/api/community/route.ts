import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('Community Posts').select('*');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '게시물을 불러오는 데 실패했습니다.' });
  }
}
