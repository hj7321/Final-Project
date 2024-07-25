'use client';

import { FormState } from '@/types/form.type';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export const getUserData = async (id: string) => {
  const supabase = createClient();
  const data = await supabase.from('Users').select('*').eq('id', id).maybeSingle();
  return data;
};

export const changeUserType = async (id: string, updatedNickname: any) => {
  const supabase = createClient();

  const data = await supabase.from('Users').update({ nickname: updatedNickname }).eq('id', id);
  return data;
};

// export async function GET() {
//   try {
//     const supabase = createClient();
//     const { data } = await supabase.from('Users').select('*');
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' });
//   }
// }

// export async function PUT(request: NextRequest) {
//   try {
//     const info = await request.json();

//     const supabase = createClient();
//     const { data, error } = await supabase.from('Users').update({ nickname: info.nickname }).eq('id', info.id);

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: '수정에 실패했습니다.' });
//   }
