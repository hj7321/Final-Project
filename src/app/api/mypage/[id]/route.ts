'use client';

import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useUserData = (id: string) => {
  const getUserData = async () => {
    const supabase = createClient();
    const data = await supabase.from('Users').select('*').eq('id', id).maybeSingle();
    return data;
  };

  return useQuery({
    queryKey: ['Users', id],
    queryFn: getUserData
  });
};
