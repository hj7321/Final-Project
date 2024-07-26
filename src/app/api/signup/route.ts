import { FormState } from '@/types/form.type';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { email, password, nickname, name, birth } = (await request.json()) as FormState;

  // 서버 측에서도 supabase에 데이터 저장하기 전에 검증 과정 필요!!

  // 1) auth 테이블에 회원정보 저장(회원가입)
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName: nickname,
        name,
        birth
      }
    }
  });

  if (signUpError) {
    console.log('회원가입 실패: ', signUpError.message);
    return Response.json({ errorMsg: signUpError.message });
  } else console.log('회원가입 성공');

  // 2) Users 테이블에 회원정보 저장
  const { data: usersInsertData, error: usersInsertError } = await supabase.from('Users').insert({
    email,
    nickname,
    birth,
    name
  });

  if (usersInsertError) {
    console.log('Users 테이블에 회원정보 저장 실패: ', usersInsertError.message);
    return Response.json({ errorMsg: usersInsertError.message });
  } else console.log('Users 테이블에 회원정보 저장 성공');

  // 3) 회원가입 하면 자동 로그인
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    console.log('로그인 실패: ', loginError.message);
    return Response.json({ errorMsg: loginError.message });
  } else {
    console.log('로그인 성공');
    console.log(loginData);
    return Response.json({ userData: loginData });
  }
}
