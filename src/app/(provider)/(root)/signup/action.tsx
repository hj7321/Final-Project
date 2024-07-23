import { createClient } from '@/utils/supabase/client';

export default async function signUp(email: string, password: string, nickname: string, name: string, birth: string) {
  const supabase = createClient();

  const data = { email, password, nickname, name, birth };

  // 서버 측에서도 supabase에 데이터 저장하기 전에 검증 과정 필요!!

  // 1) auth 테이블에 회원정보 저장(회원가입)
  const { error } = await supabase.auth.signUp(data);

  if (error) console.log('회원가입 실패: ', error.message);

  console.log('회원가입 성공');

  // 2) Users 테이블에 회원정보 저장
  const { data: signUpData, error: signUpError } = await supabase.from('Users').insert({ email, nickname });

  if (signUpError) console.log('Users 테이블에 회원정보 저장 실패: ', signUpError.message);

  console.log('Users 테이블에 회원정보 저장 성공');
}
