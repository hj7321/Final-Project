import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// TODO: 내부 로직은 프로젝트에 따라 반드시 바꿔야 함
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        }
      }
    }
  );

  // createServerClient와 supabase.auth.getUser() 사이에 로직을 작성하면 안 된다.
  // 간단한 실수로 인해 사용자가 무작위로 로그아웃되는 문제를 디버깅하기가 매우 어려워질 수 있다.

  const {
    data: { user }
  } = await supabase.auth.getUser();

  // 사용자가 없는데(세션 만료) 의뢰 또는 커뮤티니 글쓰기 페이지인 경우 로그인 페이지로 리디렉션
  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/pro/createCard') ||
      request.nextUrl.pathname.startsWith('/createPost') ||
      request.nextUrl.pathname.startsWith('/mypage'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  // 반드시 supabaseResponse 객체를 그대로 반환해야 한다.
  // NextResponse.next()를 사용하여 새 응답 객체를 생성하는 경우, 다음을 따라야 한다.
  // 1. 다음과 같이 요청을 전달한다.
  //    const myNewResponse = NextResponse.next({request})
  // 2. 다음과 같이 쿠키를 복사한다.
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. 필요에 맞게 myNewResponse 객체를 변경하되, 쿠키를 변경하면 안 된다.
  // 4. 마지막으로, myNewResponse를 반환한다.
  // 이렇게 하지 않으면, 브라우저와 서버가 동기화되지 않고 사용자의 세션이 조기에 종료될 수 있다.

  return supabaseResponse;
}
