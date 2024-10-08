'use client';

import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatNotification from '../ChatNotification';

interface LoginHeaderProp {
  isLogin: boolean;
  nickname: string | null | undefined;
}

export default function LoginHeader({ isLogin, nickname }: LoginHeaderProp) {
  const router = useRouter();
  const { logout, userId, initializeAuthState } = useAuthStore();

  useEffect(() => {
    initializeAuthState();
  }, [initializeAuthState]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST'
    });
    logout();
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="flex items-center gap-[24px]">
      <div className="flex flex-shrink-0 pt-1">
        {/* 채팅알림 */}
        {isLogin && <ChatNotification userId={userId!} />}
      </div>
      <div className="flex items-center gap-[10px] lg:gap-[24px] break-keep">
        <Link href={`/mypage/${userId}`} className="text-grey-500 hover:text-grey-700 text-[14px] lg:text-[16px]">
          <b className="text-primary-500 hover:text-primary-700">{nickname}</b>님
        </Link>
        <button
          onClick={handleLogout}
          className={clsx(
            'w-[75px] h-[30px] text-[12px] p-[4px] lg:w-[100px] lg:h-[40px] lg:text-[16px] lg:px-[16px] lg:py-[8px] rounded-[8px] text-center bg-grey-200 hover:bg-grey-300 text-white'
          )}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
