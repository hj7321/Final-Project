'use client';

import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useRef, useState } from 'react';
import Cookies from 'js-cookie';

const inputs = [
  { label: '이메일', type: 'text', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw', icon: true }
];

const webBtnStyle = 'h-[56px] w-[400px] rounded-[12px] text-black flex justify-center items-center gap-[32px]';
const mobileBtnStyle = 'w-[64px] h-[64px] rounded-full flex justify-center items-center';

export default function LoginPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill(''));
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const { login, setUserId, setUserData } = useAuthStore();

  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValues(newValues);
  };

  const handleTogglePassword = (): void => {
    const newVisibility = !showPassword;
    setShowPassword(newVisibility);
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
    console.log('로그인 성공!');
    form.reset();
    login();
    setUserId(data.userData.user.id);
    setUserData(data.userData.user.user_metadata);

    const redirectPage = Cookies.get('returnPage');
    Cookies.remove('returnPage');
    router.replace(redirectPage!);
  };

  const handleKakaoLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: 'https://final-project-flame-nu.vercel.app/api/login/callback'
      }
    });
    if (error) console.error('카카오 로그인 에러: ', error);
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://final-project-flame-nu.vercel.app/api/login/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    if (error) console.error('구글 로그인 에러: ', error);
  };

  const handleGitHubLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'https://final-project-flame-nu.vercel.app/api/login/callback'
      }
    });
    if (error) console.error('깃허브 로그인 에러: ', error);
  };

  return (
    <section className="flex flex-col text-center items-center md:bg-grey-50">
      <div className="flex flex-col justify-center items-center w-[528px] h-[835px] bg-white py-[64px] rounded-[24px]">
        <Image src="/logo_eng.svg" alt="영어 로고" width={180} height={60} className="hidden md:flex mb-[32px]" />
        <div className="relative flex justify-center items-center text-center md:hidden w-[328px] h-[48px] mb-[32px]">
          <Link href="/" className="left-0 absolute">
            <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
          </Link>
          <Image src="/logo_eng.svg" alt="영어 로고" width={144} height={48} />
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-[10px] items-center">
          {inputs.map((input, idx) => (
            <div key={input.id} className="flex flex-col items-center relative">
              <div
                className={clsx(
                  'w-[328px] md:w-[400px] border rounded-[8px] px-[16px]',
                  idx === selectedIdx
                    ? 'h-[70px] border-primary-500 pt-[6px]'
                    : inputValues[idx].length === 0
                    ? 'h-[56px] border-grey-100 py-[16px]'
                    : 'h-[70px] border-grey-500 pt-[6px]'
                )}
              >
                <label
                  className={clsx(
                    'self-start text-[12px]',
                    idx === selectedIdx
                      ? 'flex text-primary-500'
                      : inputValues[idx].length > 0
                      ? 'flex text-grey-300'
                      : 'hidden'
                  )}
                  htmlFor={input.id}
                >
                  {input.label}
                </label>
                <div className="flex">
                  <input
                    className={clsx(
                      (idx === selectedIdx || inputValues[idx]!.length > 0) &&
                        'w-[312px] outline-none border-none p-0 mt-[5px]',
                      'placeholder-grey-300'
                    )}
                    type={showPassword ? 'text' : input.type}
                    id={input.id}
                    name={input.id}
                    placeholder={input.label}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    onFocus={() => setSelectedIdx(idx)}
                    onBlur={() => setSelectedIdx(null)}
                    value={inputValues[idx] || ''}
                    onChange={(e) => handleInputChange(idx, e)}
                  />
                  {input.icon && (
                    <button type="button" className="flex items-center" onClick={handleTogglePassword}>
                      <Image
                        src="/eye_closed_grey.svg"
                        alt="비밀번호 숨기기"
                        width={24}
                        height={24}
                        className={clsx('absolute right-[16px] cursor-pointer', showPassword ? 'hidden' : 'block')}
                      />
                      <Image
                        src="/eye_opened_grey.svg"
                        alt="비밀번호 보기"
                        width={24}
                        height={24}
                        className={clsx('absolute right-[16px] cursor-pointer', showPassword ? 'block' : 'hidden')}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button
            type="submit"
            className={clsx(
              'Body-M',
              'h-[56px] w-[328px] md:w-[400px] rounded-[8px] bg-primary-500 hover:bg-primary-700 text-white mt-[32px] mb-[16px]'
            )}
          >
            로그인
          </button>
        </form>

        <div className="w-[328px] md:w-[400px] text-[#afafaf] flex justify-end mb-[32px]">
          <Link href="/login/sendLink" className="flex text-grey-600 hover:underline">
            <p className={clsx('Caption2-M', 'md:hidden')}>비밀번호 찾기&nbsp;&nbsp;{'>'}</p>
            <p className={clsx('Body-M', 'hidden md:block')}>비밀번호 찾기&nbsp;&nbsp;{'>'}</p>
          </Link>
        </div>

        <div className="flex flex-col mb-[32px]">
          <p className="text-[#afafaf] text-[12px] mb-[24px] md:hidden">────────── 다른 방법으로 로그인 ──────────</p>
          <div className="flex justify-center gap-[16px] md:hidden">
            <button onClick={handleKakaoLogin} className={clsx(mobileBtnStyle, 'bg-[#fee500] hover:bg-[#EED600]')}>
              <Image src="/icon_kakao.svg" alt="카카오" width={26} height={26} />
            </button>
            <button onClick={handleGoogleLogin} className={clsx(mobileBtnStyle, 'bg-[#F8F9FD] hover:bg-[#E2E5F3]')}>
              <Image src="/icon_google.svg" alt="구글" width={26} height={26} />
            </button>
            <button onClick={handleGitHubLogin} className={clsx(mobileBtnStyle, 'bg-[#ECEDF0] hover:bg-[#D9DEE3]')}>
              <Image src="/icon_github.svg" alt="깃허브" width={26} height={26} />
            </button>
          </div>

          <p className="text-[#afafaf] text-[12px] mb-[24px] hidden md:block">
            ──────────── 다른 방법으로 로그인 ────────────
          </p>
          <div className="hidden md:flex md:flex-col md:items-center md:gap-[16px]">
            <button onClick={handleKakaoLogin} className={clsx(webBtnStyle, 'bg-[#fee500] hover:bg-[#EED600]')}>
              <Image src="/icon_kakao.svg" alt="카카오" width={26} height={27} />
              카카오로 로그인하기
            </button>
            <button onClick={handleGoogleLogin} className={clsx(webBtnStyle, 'bg-[#F8F9FD] hover:bg-[#E2E5F3]')}>
              <Image src="/icon_google.svg" alt="구글" width={26} height={27} />
              Google로 로그인하기
            </button>
            <button onClick={handleGitHubLogin} className={clsx(webBtnStyle, 'bg-[#ECEDF0] hover:bg-[#D9DEE3]')}>
              <Image src="/icon_github.svg" alt="깃허브" width={26} height={27} />
              GitHub로 로그인하기
            </button>
          </div>
        </div>

        <div className={clsx('Caption2-M', 'flex justify-center gap-[24px]')}>
          <p className="text-grey-300">아직 회원이 아니신가요?</p>
          <Link href="/signup" className="font-bold">
            회원가입 하기 {'>'}
          </Link>
        </div>
      </div>
    </section>
  );
}
