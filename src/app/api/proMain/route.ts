import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '0', 10);
  const limit = 10; // 한 번에 불러올 데이터 수
  const offset = page * limit;

  const languages: string[] = JSON.parse(decodeURIComponent(url.searchParams.get('languages') || '[]'));

  try {
    const supabase = createClient();
    let query = supabase
      .from('Request Posts')
      .select('*')
      .range(offset, offset + limit - 1); // 페이징 처리를 위한 설정

    if (languages.length > 0) {
      const orConditions = languages.map(language => `lang_category.cs.{${language}}`).join(',');
      query = query.or(orConditions);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ error: '데이터를 가져오는데 실패했습니다' });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: '데이터를 가져오는데 실패했습니다' });
  }
}

