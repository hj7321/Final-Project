import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.from('Portfolio').select('*').eq('id', params.id);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('포트폴리오를 찾을 수 없습니다.');
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' });
  }
}
