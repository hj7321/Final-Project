// 'use client';

// import { createClient } from '@/utils/supabase/client';
// import { useQuery } from '@tanstack/react-query';

// export const useUserData = (id: string) => {
//   const getUserData = async () => {
//     const supabase = createClient();
//     const data = await supabase.from('Users').select('*').eq('id', id).maybeSingle();
//     return data;
//   };

//   return useQuery({
//     queryKey: ['Users', id],
//     queryFn: getUserData
//   });
// };
import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';
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