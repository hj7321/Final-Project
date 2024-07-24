import { FormState } from '@/types/auth.type';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { email, password, nickname, name, birth } = (await request.json()) as FormState;
  console.log(email);
  console.log(password);
  console.log(nickname);
  console.log(name);
  console.log(birth);

  // 서버 측에서도 supabase에 데이터 저장하기 전에 검증 과정 필요!!

  // 1) auth 테이블에 회원정보 저장(회원가입)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
        name,
        birth
      }
    }
  });

  if (error) console.log('회원가입 실패: ', error.message);
  else console.log('회원가입 성공');

  // 2) Users 테이블에 회원정보 저장
  const { data: signUpData, error: signUpError } = await supabase.from('Users').insert({ email, nickname });

  if (signUpError) console.log('Users 테이블에 회원정보 저장 실패: ', signUpError.message);
  else console.log('Users 테이블에 회원정보 저장 성공');

  return Response.json({ errorMsg: error?.message || null });
}
