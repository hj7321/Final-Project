'use client';

import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { validateForms } from '../signup/_components/Validate';
import useFetchData from '@/hooks/useFetchData';
import { Report } from 'notiflix';

const inputs = [
  { label: '이메일', type: 'text', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw', icon: true }
];

const webBtnStyle = 'h-[56px] w-[400px] rounded-[12px] text-black flex justify-center items-center gap-[32px]';
const mobileBtnStyle = 'w-[64px] h-[64px] rounded-full flex justify-center items-center';

export default function LoginPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // 각 인풋 요소를 가리키는 참조 변수 배열
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null); // 선택된 인풋 필드의 인덱스
  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill('')); // 각 인풋 필드의 값(내용)이 담긴 배열
  const [showPassword, setShowPassword] = useState<boolean>(false); // 비밀번호를 표시할지 여부를 결정하는 boolean 값
  const [inputMsgs, setInputMsgs] = useState<string[]>(Array(inputs.length).fill('')); // 각 인풋 필드의 유효성 메시지가 담긴 배열

  const { emailData } = useFetchData(); // Users 테이블의 모든 이메일이 담긴 배열

  const [throttling, setThrottling] = useState<boolean>(false); // 버튼 연속 클릭 방지

  const router = useRouter();

  const { login, setUserId } = useAuthStore(); // 각각 로그인 함수, 유저 고유 아이디 설정 함수, 유저 정보 설정 함수

  // 인풋 필드의 값이 바뀔(입력될) 때마다 호출되는 이벤트 핸들러 -> 값에 맞는 유효성 메시지가 실시간으로 바뀜
  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValues(newValues);

    const alertMessage = validateForms(newValues[1], 1); // 로그인 페이지에서는 비밀번호 유효성 검사만 실시함
    const newMsgs = [...inputMsgs];
    if (idx === 0 && !emailData!.includes(newValues[0])) {
      newMsgs[0] = '존재하지 않는 이메일입니다.';
    } else if (idx === 0 && emailData!.includes(newValues[0])) {
      newMsgs[0] = '';
    } else {
      newMsgs[1] = alertMessage;
    }
    setInputMsgs(newMsgs);
  };

  // 비밀번호를 보여줄지, 숨길지 여부를 결정하는 이벤트 핸들러
  const handleTogglePassword = (): void => {
    const newVisibility = !showPassword;
    setShowPassword(newVisibility);
  };

  // 로그인을 진행하는 이벤트 핸들러
  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    const areInputValuesNull: string[] = inputValues.filter((value) => value === '');

    if (inputMsgs[0] !== '') {
      inputRefs.current[0]!.focus();
      return;
    } else if (inputMsgs[1] !== '') {
      inputRefs.current[1]!.focus();
      return;
    } else if (areInputValuesNull.length !== 0) {
      return Report.failure('로그인 실패', '회원 정보를 모두 기입해주세요.', '확인');
    }

    setThrottling(true); // 모든 조건을 통과했으므로, 이 시점에서 버튼 클릭을 막음 (연속 제출 방지)

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email: string = formData.get('email') as string;
    const password: string = formData.get('pw') as string;

    // 로그인 라우트 핸들러에 보낼 유저 정보를 하나의 객체로 만듦
    const dataForSubmit = { email, password };

    // 로그인 라우트 핸들러 호출
    const data = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForSubmit)
    }).then((res) => res.json());

    if (data.errorMsg) {
      // 여기에서 에러가 나는 이유는 비밀번호를 잘못 입력했기 때문임
      setThrottling(false); // 다시 버튼 클릭을 허용함
      const newMsgs = [...inputMsgs];
      newMsgs[1] = '비밀번호를 정확히 입력해주세요.';
      setInputMsgs(newMsgs);
      inputRefs.current[1]!.focus();
      return;
    }

    // 로그인 성공 후 로직
    form.reset(); // (1) 폼 내용 모두 리셋
    login(); // (2) 로그인된 상태로 설정
    setUserId(data.userData.user.id); // (3) 유저 고유 아이디 설정
    // (4) 로그인 페이지로 오기 전 페이지로 리다이렉트
    const redirectPage = Cookies.get('returnPage'); // (4-1) 쿠키에서 "returnPage"를 키로 하는 값(pathname)을 가져옴
    Cookies.remove('returnPage'); // (4-2) 쿠키에서 "returnPage"를 키로 하는 값(pathname)을 지움
    if (redirectPage === '/signup' || redirectPage?.startsWith('/login') || !redirectPage) router.replace('/');
    // (4-3) 돌아갈 페이지가 회원가입 페이지 또는 로그인 관련 페이지이거나 없다면, 현재 페이지를 홈페이지로 대체
    else router.replace(redirectPage!);
    // (4-3) 위의 경우가 아니라면, 현재 페이지를 로그인 페이지로 오기 전 페이지로 대체
    router.refresh();
  };

  // 카카오 소셜 로그인을 진행하는 이벤트 핸들러
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

  // 구글 소셜 로그인을 진행하는 이벤트 핸들러
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

  // 깃허브 소셜 로그인을 진행하는 이벤트 핸들러
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
    <section className="flex flex-col text-center items-center justify-center md:bg-grey-50">
      <div className="md:w-[528px] flex flex-col items-center p-[64px] bg-white">
        <Image src="/logo_eng.svg" alt="영어 로고" width={180} height={60} className="hidden md:flex mb-[32px]" />
        <div className="relative flex justify-center items-center text-center md:hidden w-[328px] h-[48px] mb-[32px]">
          <Link href="/" className="left-0 absolute">
            <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
          </Link>
          <Image src="/logo_eng.svg" alt="영어 로고" width={144} height={48} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 폼 제출 방지
            // 버튼 클릭을 허용한 경우(throttling 변수가 false일 경우)에만 handleLogin 이벤트 핸들러 호출
            if (!throttling) handleLogin(e);
          }}
          className="flex flex-col gap-[10px] items-center"
        >
          {inputs.map((input, idx) => (
            <div key={input.id} className="flex flex-col items-center relative">
              <div
                className={clsx(
                  'w-[328px] md:w-[400px] h-[56px] md:h-[66px] border rounded-[8px] px-[16px]',
                  idx === selectedIdx
                    ? 'border-primary-500 pt-[6px]'
                    : inputValues[idx].length === 0
                    ? 'border-grey-100 py-[16px] md:py-[20px]'
                    : inputMsgs[idx].length === 0
                    ? 'border-grey-500 pt-[6px]'
                    : 'border-error pt-[6px]'
                )}
              >
                <label
                  className={clsx(
                    'self-start text-[10px] md:text-[12px]',
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
                        'w-[312px] outline-none border-none p-0 mt-[3px] md:mt-[5px]',
                      'placeholder-grey-300 text-[14px] md:text-[16px] w-[310px]'
                    )}
                    type={showPassword ? 'text' : input.type}
                    id={input.id}
                    name={input.id}
                    placeholder={idx === selectedIdx ? '' : input.label}
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
                        className={clsx(
                          'absolute right-[16px] cursor-pointer w-[20px] h-[20px] md:w-[24px] md:h-[24px]',
                          showPassword ? 'hidden' : 'block'
                        )}
                      />
                      <Image
                        src="/eye_opened_grey.svg"
                        alt="비밀번호 보기"
                        width={24}
                        height={24}
                        className={clsx(
                          'absolute right-[16px] cursor-pointer w-[20px] h-[20px] md:w-[24px] md:h-[24px]',
                          showPassword ? 'block' : 'hidden'
                        )}
                      />
                    </button>
                  )}
                </div>
              </div>
              <p
                className={
                  inputMsgs[idx].length > 0
                    ? 'block self-start text-[11px] md:text-[13.5px] my-[3px] ml-[3px] text-error'
                    : 'hidden'
                }
              >
                {inputMsgs[idx]}
              </p>
            </div>
          ))}
          <button
            type="submit"
            className={clsx(
              'h-[56px] w-[328px] md:w-[400px] rounded-[8px] mt-[32px] mb-[16px]',
              throttling
                ? 'hover:cursor-default bg-primary-300 text-white bg-opacity-50 text-opacity-50'
                : 'bg-primary-500 hover:bg-primary-700 text-white'
            )}
          >
            로그인
          </button>
        </form>

        <div className="w-[328px] md:w-[400px] text-[#afafaf] flex justify-end mb-[32px]">
          <Link href="/login/sendLink" className="flex text-grey-600 hover:underline">
            <p className="text-[12px] md:text-[16px]">비밀번호 찾기&nbsp;&nbsp;{'>'}</p>
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

        <div className="flex justify-center gap-[24px] text-[12px] md:text-[14px]">
          <p className="text-grey-300">아직 회원이 아니신가요?</p>
          <Link href="/signup" className="font-bold">
            회원가입 하기 {'>'}
          </Link>
        </div>
      </div>
    </section>
  );
}
