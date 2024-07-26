'use client';

import { createClient } from '@/utils/supabase/client';
// 회원가입 페이지 코드와 겹치는 부분이 많은데 나중에 리팩토링 해야함
// 겹치는 부분 커스텀 훅으로 분리

import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useRef, useState } from 'react';

const inputs = [
  { label: '이메일', type: 'text', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw' }
];

export default function LoginPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputValues, setInputValue] = useState<(string | null)[]>(Array(inputs.length).fill(''));

  const router = useRouter();

  const { login, setUserId, setUserData } = useAuthStore();

  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValue(newValues);
  };

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email: string = formData.get('email') as string;
    const password: string = formData.get('pw') as string;

    const dataForSubmit = { email, password };
    const data = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForSubmit)
    }).then((res) => res.json());

    if (data.errorMsg) {
      alert(data.errorMsg);
      return;
    }
    alert('로그인 성공!');
    form.reset();
    login();
    console.log(data.userData);
    setUserId(data.userData.user.id);
    setUserData(data.userData.user.user_metadata);

    router.back(); // 이거 나중에 고쳐야 함!!
  };

  const handleKakaoLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: 'http://localhost:3000/signup/signUpComplete'
      }
    });
    if (error) console.log('카카오 로그인 에러');
    if (data) console.log(data);
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/signup/signUpComplete',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    if (error) console.log('구글 로그인 에러');
    if (data) console.log(data);
  };

  const handleGitHubLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/signup/signUpComplete'
      }
    });
    if (error) console.log('깃허브 로그인 에러');
    if (data) console.log(data);
  };

  const buttonStyle =
    'h-[56px] w-[400px] rounded-[12px] text-black font-bold flex justify-center items-center gap-[32px]';

  return (
    <section className="flex flex-col text-center items-center py-[64px]">
      <form onSubmit={handleLogin} className="flex flex-col gap-[10px]">
        <h2 className="font-bold text-[24px] mb-[48px]">로고</h2>
        {inputs.map((input, idx) => (
          <div
            key={idx}
            className={clsx(
              'flex flex-col items-center',
              (idx === selectedIdx || inputValues[idx]!.length > 0) &&
                'h-[70px] w-[400px] border border-black rounded-[8px] px-[16px] pt-[6px]'
            )}
          >
            <label
              className={clsx(
                idx === selectedIdx || inputValues[idx]!.length > 0 ? 'flex' : 'hidden',
                'self-start text-[12px]'
              )}
              htmlFor={input.id}
            >
              {input.label}
            </label>
            <input
              className={clsx(
                idx === selectedIdx || inputValues[idx]!.length > 0
                  ? 'w-[362px] outline-none border-none p-0 mt-[5px]'
                  : 'h-[56px] w-[400px] border border-main p-[16px] rounded-[8px]'
              )}
              type={input.type}
              id={input.id}
              name={input.id}
              placeholder={input.label}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              onClick={() => setSelectedIdx(idx)}
              value={inputValues[idx] || ''}
              onChange={(e) => handleInputChange(idx, e)}
            />
          </div>
        ))}
        <button
          type="submit"
          className="h-[56px] w-[400px] rounded-[8px] bg-black text-white font-bold mt-[48px] mb-[16px]"
        >
          로그인
        </button>
      </form>

      <div className="w-[400px] text-[#afafaf] flex justify-center mb-[48px]">
        <Link href="#" className="mx-[40px] hover:underline">
          아이디 찾기
        </Link>
        <Link href="#" className="mx-[40px] hover:underline">
          비밀번호 찾기
        </Link>
      </div>

      <div className="flex flex-col mb-[48px]">
        <p className="text-[#afafaf] text-[12px] mb-[24px]">─────────────────── 또는 ───────────────────</p>
        <div className="flex flex-col gap-[16px]">
          <button onClick={handleKakaoLogin} className={clsx(buttonStyle, 'bg-[#fee500]')}>
            <p>(로고)</p>
            카카오로 로그인하기
          </button>
          <button onClick={handleGoogleLogin} className={clsx(buttonStyle, 'bg-[#ffffff] border border-gray')}>
            <p>(로고)</p>
            구글로 로그인하기
          </button>
          <button onClick={handleGitHubLogin} className={clsx(buttonStyle, 'bg-[#ffffff] border border-gray')}>
            <p>(로고)</p>
            깃허브로 로그인하기
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-[24px] text-[12px]">
        <p>아직 회원이 아니신가요?</p>
        <Link href="/signup" className="font-bold">
          회원가입 하기 {'>'}
        </Link>
      </div>
    </section>
  );
}
