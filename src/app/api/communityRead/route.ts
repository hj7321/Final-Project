import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('Community Posts').select('*').limit(100);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' });
  }
}
