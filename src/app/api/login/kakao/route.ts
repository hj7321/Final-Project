import { createClient } from '@/utils/supabase/server';

export async function POST() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: 'https://ivuhyqkdxiwtufnsgxcv.supabase.co/auth/v1/callback'
    }
  });
}
