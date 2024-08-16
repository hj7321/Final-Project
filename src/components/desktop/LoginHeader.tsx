'use client';

import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatNotification from '../ChatNotification';

const buttonStyle = 'w-[100px] h-[40px] px-[16px] py-[8px] rounded-[8px] text-center';

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
      <div className="flex gap-[12px] flex-shrink-0">
        <Image
          src="/alarm_comment.svg"
          alt="댓글 알림 아이콘"
          width={24}
          height={24}
          className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]"
        />
        {/* 채팅알림 */}
        {isLogin && <ChatNotification userId={userId!} />}
      </div>
      <div className="flex items-center gap-[24px] break-keep">
        <Link href={`/mypage/${userId}`} className="text-grey-500 hover:text-grey-700 text-[14px] lg:text-[16px]">
          <b className="text-primary-500 hover:text-primary-700">{nickname}</b>님
        </Link>
        <button onClick={handleLogout} className={clsx(buttonStyle, 'bg-grey-200 hover:bg-grey-300 text-white')}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
