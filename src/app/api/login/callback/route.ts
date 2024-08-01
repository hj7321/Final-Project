import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const cookieHeader = request.headers.get('cookie');
  let returnPageValue = null;

  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    cookies.forEach((cookie) => {
      const [name, value] = cookie.split('=');
      if (name.trim() === 'returnPage') returnPageValue = value.trim();
    });
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code'); // OAuth 인증 코드
  const movePage = returnPageValue;

  // Users 테이블의 전체 이메일 데이터
  const { data } = await supabase.from('Users').select('email');
  const emailData = data!.map((obj) => obj.email);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code); // 코드 교환
    if (!error) {
      // 현재 로그인한 사용자의 이메일 데이터
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const loginUserEmail = user!.email;

      const isExisting = emailData.includes(loginUserEmail!);

      // Users 테이블에 이미 있는 유저인 경우, 이전에 있던 페이지로 리디렉션
      if (isExisting) return NextResponse.redirect(`${origin}${movePage}`);
      // Users 테이블에 없는 유저인 경우, 신규 유저이므로 SignUpComplete 페이지로 리디렉션
      else return NextResponse.redirect(`${origin}/signup/signUpComplete`);
    }
  }

  // 실패 시 리디렉션
  return NextResponse.redirect(`${origin}/login/loginError`);
}
