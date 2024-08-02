import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const cookieHeader = request.headers.get('cookie');
  let returnPageValue = null;

  // key가 "returnPage"인 쿠키의 값을 구하는 과정
  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    cookies.forEach((cookie) => {
      const [name, value] = cookie.split('=');
      if (name.trim() === 'returnPage') returnPageValue = value.trim();
    });
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code'); // OAuth 인증 코드
  const movePage = returnPageValue; // 이 라우트 핸들러 로직이 끝난 후 이동할 페이지

  // (1) 코드가 있는 경우
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code); // 코드 교환
    if (!error) {
      // (2-1) 현재 로그인한 사용자의 이메일, 생성 시간 데이터를 가져옴
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const loginUserEmail: string | undefined = user!.email; // 현재 로그인한 사용자의 이메일(string)
      const loginUserCreatedAt: string = user!.created_at; // 현재 로그인한 사용자의 생성 시간(string) -> 사용 안하므로 추후 삭제

      // (2-2) Users 테이블에서 현재 로그인한 사용자의 이메일에 대응하는 created_at 칼럼만을 추출함
      const { data } = await supabase.from('Users').select('created_at').eq('email', loginUserEmail!);
      const createdAtData: string = data!.map((obj) => obj.created_at)[0];

      // 정확한 시간 비교를 위해서 createdAtData를 Data 객체로 변환
      const createdTime: Date = new Date(createdAtData); // Users 테이블에 최초 저장된 시간
      // 현재 시간을 나타내는 Date 객체 생성
      const currentTime: Date = new Date(); // 현재 시간

      // 시간 차이를 밀리초 단위로 계산
      const timeDifferenceMs: number = currentTime.getTime() - createdTime.getTime(); // 밀리초 단위의 차이

      // 밀리초 단위를 분 단위로 변환
      const timeDifferenceMinutes = timeDifferenceMs / (1000 * 60); // 1000밀리초 * 60초

      // 1분 이상 차이가 나는지 확인
      const isMoreThanTwoMinutes: boolean = timeDifferenceMinutes >= 1;

      // Users 테이블에 현재 로그인한 사용자의 생성 시간이 현재 시간으로부터 1분이 지난 경우, 이전에 있던 페이지로 리디렉션
      if (isMoreThanTwoMinutes) return NextResponse.redirect(`${origin}${movePage}`);
      // Users 테이블에 현재 로그인한 사용자의 생성 시간이 현재 시간으로부터 1분이 지나지 않은 경우, 신규 유저로 판단하고 SignUpComplete 페이지로 리디렉션
      else return NextResponse.redirect(`${origin}/signup/signUpComplete`);
    }
  }

  // (2) 코드가 없는 경우, 로그인에 실패하였으므로 소셜 로그인 실패 페이지로 리디렉션함
  return NextResponse.redirect(`${origin}/login/loginError`);
}
