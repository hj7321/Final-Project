'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const buttonStyle =
  'w-[75px] h-[30px] text-[12px] p-[4px] lg:w-[100px] lg:h-[40px] lg:text-[16px] lg:px-[16px] lg:py-[8px] rounded-[8px] text-center';

export default function LogoutHeader() {
  const router = useRouter();

  const goToLoginPage = () => {
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPage', pagePathname);
    router.push('/login');
  };

  const goToSignUpPage = () => {
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPage', pagePathname);
    router.push('/signup');
  };

  return (
    <div className="flex items-center gap-[10px] lg:gap-[16px]">
      <button
        onClick={goToLoginPage}
        className={clsx(buttonStyle, 'border border-primary-500 hover:bg-primary-50 text-primary-500')}
      >
        로그인
      </button>
      <button onClick={goToSignUpPage} className={clsx(buttonStyle, 'bg-primary-500 hover:bg-primary-700 text-white')}>
        회원가입
      </button>
    </div>
  );
}
