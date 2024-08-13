'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const buttonStyle = 'w-[100px] h-[40px] px-[16px] py-[8px] rounded-[8px] text-center';

interface LogoutHeaderLayoutProps {
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function LogoutHeaderLayout({ setSelectedIdx }: LogoutHeaderLayoutProps) {
  const router = useRouter();

  const goToLoginPage = () => {
    setSelectedIdx(null);
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPage', pagePathname);
    router.push('/login');
  };

  const goToSignUpPage = () => {
    setSelectedIdx(null);
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPage', pagePathname);
    router.push('/signup');
  };

  return (
    <div className="flex items-center gap-[16px] text-[16px]">
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
