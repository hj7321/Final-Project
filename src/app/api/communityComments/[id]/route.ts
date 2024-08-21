import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const supabase = createClient();
    const { data, error } = await supabase.from('Community Comments').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '삭제에 실패했습니다.' });
  }
}
