import { createClient } from '@/utils/supabase/server';
import Header from './header';

export default async function ServerHeader() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let nickname: string | null | undefined;
  if (user) {
    const { data } = await supabase.from('Users').select('nickname').eq('id', user!.id).maybeSingle();
    nickname = data?.nickname || null;
  }

  const isLogin = !!user;

  return <Header isLogin={isLogin} nickname={nickname} />;
}
