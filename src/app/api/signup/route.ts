import { FormState } from '@/types/form.type';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { email, password, nickname, name, birth } = (await request.json()) as FormState;

  // 서버 측에서도 supabase에 데이터 저장하기 전에 검증 과정 필요!!

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName: nickname,
        name: nickname,
        full_name: name,
        birth,
        avatar_url: null
      }
    }
  });

  if (signUpError) {
    console.log(signUpError);
    console.log('회원가입 실패: ', signUpError.message);
    return Response.json({ errorMsg: signUpError.message });
  } else {
    console.log('회원가입 성공');
    return Response.json({ userData: signUpData });
  }
}

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase.from('Users').select('email, nickname');
  const emailData = data?.map((obj) => obj.email);
  const nicknameData = data?.map((obj) => obj.nickname);

  return Response.json({ emailData, nicknameData });
}
