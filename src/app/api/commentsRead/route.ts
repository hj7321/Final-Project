import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('Community Comments').select('*');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const info = await request.json();

    const supabase = createClient();
    const { data, error } = await supabase.from('Community Comments').delete().eq('id', info.id);

    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '삭제에 실패했습니다.' });
  }
}
