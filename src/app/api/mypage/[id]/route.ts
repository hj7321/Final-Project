import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

// 이걸 사용하는 부분이 없음(그리고 이 코드 api > users > [userId] 코드랑 겹침)
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }
  const { data, error } = await supabase.from('Users').select('*').eq('id', id).maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
