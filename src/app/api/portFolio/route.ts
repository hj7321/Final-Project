import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

// export const portfolio = (id: string, title: string, content: string) => {
//   const eddPortfolio = async () => {
//     const supabase = createClient();
//     const { id } = useParams();
//     const data = await supabase.from('Portfolio').update({ title, content }).eq('id', id).maybeSingle();
//     return data;
//   };
//   return useQuery({
//     queryKey: ['Portfolio', id],
//     queryFn: eddPortfolio
//   });
// };

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
