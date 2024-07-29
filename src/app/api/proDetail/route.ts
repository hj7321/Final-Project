import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Request Posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    console.log('데이터 가져옴');
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: '데이터 가져오기 실패' }, { status: 500 });
  }
}
