import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

// async function signUp(formData) {
//   const { email, password, nickname, birth } = formData;
//   const { data, error } = await supabase.auth.Signup({
//     email,
//     password
//   });
//   if (error) {
//     console.error(error);
//     // 에러 처리
//     return;
//   }

//   // TODO: supabase.from 치면 테이블 나오도록 구현해야 함 -> 스탠다드 17차
//   const { data: signUpData, error: signUpError } = await supabase.from('users').insert({ email, nickname });
//   if (signUpError) {
//     console.error(error);
//     // 에러 처리
//     return;
//   }

//   return signUpData;
// }

export default function SignUpForm() {
  const inputClassName = 'h-[40px] w-[250px]';
  return (
    <section className="border border-main flex flex-col gap-[10px] my-[10px] h-[600px] text-center justify-center">
      <label htmlFor="email">
        이메일: <input className={inputClassName} type="text" id="email" />
      </label>
      <label htmlFor="pw">
        비밀번호: <input className={inputClassName} type="password" id="pw" />
      </label>
      <label htmlFor="pw-check">
        비밀번호 확인: <input className={inputClassName} type="password" id="pw-check" />
      </label>
      <label htmlFor="nickname">
        닉네임: <input className={inputClassName} type="text" id="nickname" />
      </label>
      <label htmlFor="birth">
        생년월일: <input className={inputClassName} type="date" id="birth" />
      </label>
      <div>
        <input type="checkbox" /> 전체 동의
        <input type="checkbox" /> 만 14세 이상입니다.
        <input type="checkbox" /> 약관1
        <input type="checkbox" /> 약관2
        <input type="checkbox" /> 약관3
      </div>
    </section>
  );
}
