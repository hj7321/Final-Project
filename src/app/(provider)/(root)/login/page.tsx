'use client';

import { createClient } from '@/utils/supabase/client';
// 회원가입 페이지 코드와 겹치는 부분이 많은데 나중에 리팩토링 해야함
// 겹치는 부분 커스텀 훅으로 분리

import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useRef, useState } from 'react';

const inputs = [
  { label: '이메일', type: 'text', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw', icon: true }
];

export default function LoginPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputValues, setInputValue] = useState<string[]>(Array(inputs.length).fill(''));
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const { login, setUserId, setUserData } = useAuthStore();

  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValue(newValues);
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
      {/* <section> */}
      <form onSubmit={handleLogin} className="flex flex-col gap-[10px] items-center">
        <svg
          className="mb-[48px]"
          width="180"
          height="60"
          viewBox="0 0 180 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.58534 26.6108L8.55441 26.5798L20.0097 15.1245C21.4722 13.662 23.8713 13.5523 25.3619 14.9867C26.8525 16.4211 26.8975 18.8651 25.4125 20.3501L16.961 28.8017C16.3085 29.4542 16.3085 30.5145 16.961 31.167L25.3169 39.5229C26.785 40.9911 26.8975 43.4014 25.4547 44.8892C23.9922 46.3995 21.5791 46.4136 20.0997 44.9314L8.85816 33.6898C6.91753 31.7492 6.83034 28.6583 8.58816 26.6079L8.58534 26.6108Z"
            fill="#253CE5"
          />
          <path
            d="M149.612 19.1471C150.1 17.3562 149.043 15.5088 147.253 15.0209C145.462 14.533 143.614 15.5893 143.126 17.3802L136.731 40.8528C136.243 42.6437 137.3 44.4911 139.091 44.979C140.882 45.4669 142.729 44.4106 143.217 42.6197L149.612 19.1471Z"
            fill="#253CE5"
          />
          <path
            d="M48.8819 33.4931C51.0363 33.4931 52.6478 35.5068 52.1388 37.5993C51.9053 38.5584 51.596 39.4106 51.205 40.1559C49.4838 43.3537 46.5138 44.6109 41.4175 44.6109C33.8913 44.6109 29.5375 40.6115 29.5038 32.7309V28.9622C29.4363 21.27 33.4188 17.4253 41.4175 17.4253C46.7781 17.4253 50.2319 19.3322 51.776 23.5734C52.5747 25.7644 50.9716 28.0875 48.64 28.0875H48.5585C47.2281 28.0875 46.0019 27.3056 45.4928 26.0765C44.8122 24.4312 43.5578 23.6325 41.35 23.6325C37.9413 23.6325 36.5913 25.2694 36.625 29.4965V32.3512C36.6588 36.7303 38.3125 38.4431 41.6875 38.4431C43.96 38.4431 45.1469 37.6894 45.6728 35.8978C46.0919 34.4747 47.3969 33.4931 48.8819 33.4931Z"
            fill="#253CE5"
          />
          <path
            d="M54.3694 36.8851V32.9026C54.3385 27.5026 57.0666 25.4438 62.911 25.4438C68.6963 25.4776 71.3935 27.5364 71.3625 32.9026V36.8851C71.3316 42.3189 68.4263 44.6139 62.821 44.6139C57.2157 44.6139 54.3975 42.3189 54.3694 36.8851Z"
            fill="#253CE5"
          />
          <path
            d="M73.0742 37.3913V32.6663C73.0742 30.9451 73.3442 29.5613 73.8505 28.5151C74.863 26.4901 77.0567 25.5451 80.938 25.5451H83.9417V23.9757C83.9417 22.1588 85.4155 20.6851 87.2323 20.6851C89.0492 20.6851 90.523 22.1588 90.523 23.9757V39.3601C90.523 42.001 88.3827 44.1413 85.7417 44.1413H80.0605C75.0992 44.1413 73.0742 42.1163 73.0742 37.3913Z"
            fill="#253CE5"
          />
          <path
            d="M101.619 44.6109C95.5776 44.6109 92.2363 42.0459 92.2363 37.0172V33.6422C92.2363 27.8709 95.3751 25.4409 101.619 25.4409C107.863 25.4409 110.934 28.3434 110.934 33.9122C110.954 35.7515 109.466 37.2534 107.626 37.2534H99.3407C98.556 37.2534 98.0526 38.145 98.5138 38.7806C99.0454 39.5119 100.038 39.855 101.619 39.855C103.008 39.855 103.993 39.6272 104.535 39.0534C105.002 38.5584 105.621 38.235 106.302 38.235H108.093C109.685 38.235 110.72 39.9872 109.879 41.34C108.504 43.5478 105.604 44.6137 101.622 44.6137L101.619 44.6109ZM103.379 33.0712C104.33 33.0712 104.755 31.8815 104.024 31.274C103.43 30.7819 102.584 30.509 101.582 30.509C100.407 30.509 99.4926 30.7734 98.9104 31.3275C98.2495 31.9547 98.7023 33.074 99.6135 33.074H103.379V33.0712Z"
            fill="#253CE5"
          />
          <path
            d="M128.254 35.3015V21.1547C128.254 19.0931 129.925 17.4253 131.984 17.4253H132.099C134.16 17.4253 135.828 19.0959 135.828 21.1547V34.095C135.828 41.2612 132.214 44.6109 124.252 44.6109C116.29 44.6109 112.676 41.3006 112.676 34.095V21.1547C112.676 19.0931 114.346 17.4253 116.405 17.4253C118.467 17.4253 120.135 19.0959 120.135 21.1547V35.3409C120.135 37.3265 121.518 38.339 124.249 38.339C126.98 38.339 128.249 37.3265 128.249 35.3015H128.254Z"
            fill="#253CE5"
          />
          <path
            d="M60.1477 36.4919C61.8019 36.4919 63.143 34.9607 63.143 33.0719C63.143 31.1831 61.8019 29.6519 60.1477 29.6519C58.4934 29.6519 57.1523 31.1831 57.1523 33.0719C57.1523 34.9607 58.4934 36.4919 60.1477 36.4919Z"
            fill="white"
          />
          <path
            d="M60.6362 34.2274C61.5356 34.2274 62.2647 33.3951 62.2647 32.3684C62.2647 31.3416 61.5356 30.5093 60.6362 30.5093C59.7369 30.5093 59.0078 31.3416 59.0078 32.3684C59.0078 33.3951 59.7369 34.2274 60.6362 34.2274Z"
            fill="#253CE5"
          />
          <path
            d="M65.6633 36.4919C67.3175 36.4919 68.6586 34.9607 68.6586 33.0719C68.6586 31.1831 67.3175 29.6519 65.6633 29.6519C64.009 29.6519 62.668 31.1831 62.668 33.0719C62.668 34.9607 64.009 36.4919 65.6633 36.4919Z"
            fill="white"
          />
          <path
            d="M66.1519 34.2274C67.0512 34.2274 67.7803 33.3951 67.7803 32.3684C67.7803 31.3416 67.0512 30.5093 66.1519 30.5093C65.2525 30.5093 64.5234 31.3416 64.5234 32.3684C64.5234 33.3951 65.2525 34.2274 66.1519 34.2274Z"
            fill="#253CE5"
          />
          <path
            d="M83.7082 36.4916C85.3625 36.4916 86.7035 34.9604 86.7035 33.0716C86.7035 31.1828 85.3625 29.6516 83.7082 29.6516C82.0539 29.6516 80.7129 31.1828 80.7129 33.0716C80.7129 34.9604 82.0539 36.4916 83.7082 36.4916Z"
            fill="white"
          />
          <path
            d="M83.2193 34.2279C84.1186 34.2279 84.8477 33.3956 84.8477 32.3688C84.8477 31.3421 84.1186 30.5098 83.2193 30.5098C82.3199 30.5098 81.5908 31.3421 81.5908 32.3688C81.5908 33.3956 82.3199 34.2279 83.2193 34.2279Z"
            fill="#253CE5"
          />
          <path
            d="M78.1936 36.4916C79.8478 36.4916 81.1889 34.9604 81.1889 33.0716C81.1889 31.1828 79.8478 29.6516 78.1936 29.6516C76.5393 29.6516 75.1982 31.1828 75.1982 33.0716C75.1982 34.9604 76.5393 36.4916 78.1936 36.4916Z"
            fill="white"
          />
          <path
            d="M77.7046 34.2274C78.604 34.2274 79.3331 33.3951 79.3331 32.3684C79.3331 31.3416 78.604 30.5093 77.7046 30.5093C76.8053 30.5093 76.0762 31.3416 76.0762 32.3684C76.0762 33.3951 76.8053 34.2274 77.7046 34.2274Z"
            fill="#253CE5"
          />
          <path
            d="M171.414 26.6108L171.445 26.5798L159.99 15.1245C158.527 13.662 156.128 13.5523 154.638 14.9867C153.147 16.4211 153.102 18.8651 154.587 20.3501L163.038 28.8017C163.691 29.4542 163.691 30.5145 163.038 31.167L154.683 39.5229C153.214 40.9911 153.102 43.4014 154.545 44.8892C156.007 46.3995 158.42 46.4136 159.9 44.9314L171.141 33.6898C173.082 31.7492 173.169 28.6583 171.411 26.6079L171.414 26.6108Z"
            fill="#253CE5"
          />
        </svg>
        {inputs.map((input, idx) => (
          <div key={input.id} className="flex flex-col items-center relative">
            <div
              className={clsx(
                // idx === selectedIdx || inputValues[idx]!.length > 0
                //   ? 'h-[70px] w-[400px] border border-primary-500 rounded-[8px] px-[16px] pt-[6px]'
                //   : 'h-[56px] w-[400px] border border-grey-100 p-[16px] rounded-[8px]'
                idx === selectedIdx && 'h-[70px] w-[400px] border border-primary-500 rounded-[8px] px-[16px] pt-[6px]',
                idx != selectedIdx &&
                  inputValues[idx].length > 0 &&
                  'h-[70px] w-[400px] border border-grey-300 rounded-[8px] px-[16px] pt-[6px]',
                idx !== selectedIdx &&
                  inputValues[idx].length === 0 &&
                  'h-[56px] w-[400px] border border-grey-100 p-[16px] rounded-[8px]'
              )}
            >
              <label
                className={clsx(
                  // idx === selectedIdx || inputValues[idx]!.length > 0 ? 'flex' : 'hidden',
                  // 'self-start text-[12px]'
                  'self-start text-[12px]',
                  (idx === selectedIdx || inputValues[idx]!.length > 0) && 'flex text-primary-500',
                  idx != selectedIdx && inputValues[idx].length > 0 && 'flex text-grey-300',
                  idx !== selectedIdx && inputValues[idx].length === 0 && 'hidden'
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
                      src="/closedEye.svg"
                      alt="비밀번호 숨기기"
                      width={24}
                      height={24}
                      className={clsx('absolute right-[16px] cursor-pointer', showPassword ? 'hidden' : 'block')}
                    />
                    <Image
                      src="/openedEye.svg"
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
          className="h-[56px] w-[400px] rounded-[8px] bg-primary-500 hover:bg-primary-700 text-white font-bold mt-[48px] mb-[16px]"
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
        <p className="text-[#afafaf] text-[12px] mb-[24px]">─────────── 다른 방법으로 로그인 ───────────</p>
        <div className="flex flex-col items-center gap-[16px]">
          <button onClick={handleKakaoLogin} className={clsx(buttonStyle, 'bg-[#fee500] hover:bg-[#EED600]')}>
            <Image src="/kakao.svg" alt="카카오" width={26} height={27} />
            카카오로 로그인하기
          </button>
          <button onClick={handleGoogleLogin} className={clsx(buttonStyle, 'bg-[#F8F9FD] hover:bg-[#E2E5F3]')}>
            <Image src="/google.svg" alt="구글" width={26} height={27} />
            Google로 로그인하기
          </button>
          <button onClick={handleGitHubLogin} className={clsx(buttonStyle, 'bg-[#ECEDF0] hover:bg-[#D9DEE3]')}>
            <Image src="/github.svg" alt="깃허브" width={26} height={27} />
            GitHub로 로그인하기
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
