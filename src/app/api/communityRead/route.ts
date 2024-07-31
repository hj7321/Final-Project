import { createClient } from '@/utils/supabase/client';
<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
=======
import { useParams } from 'next/navigation';
import { NextResponse } from 'next/server';
>>>>>>> 447e5f015a78fd70828202ba6667114d5a7fd464

export async function GET() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('Community Posts').select('*').limit(100);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' });
  }
}

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
