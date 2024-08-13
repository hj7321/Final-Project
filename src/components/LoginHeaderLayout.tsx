'use client';

import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const buttonStyle = 'w-[100px] h-[40px] px-[16px] py-[8px] rounded-[8px] text-center';

interface LoginHeaderLayoutProps {
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function LoginHeaderLayout({ setSelectedIdx }: LoginHeaderLayoutProps) {
  const router = useRouter();
  const { logout, userId, initializeAuthState } = useAuthStore();

  useEffect(() => {
    initializeAuthState();
  }, [initializeAuthState]);

  const supabase = createClient();

  const handleLogout = async () => {
    setSelectedIdx(null);
    await fetch('/api/logout', {
      method: 'POST'
    });
    logout();
    router.replace('/');
  };

  const getUserData = async () => {
    const data = await supabase.from('Users').select('*').eq('id', userId!).maybeSingle();
    return data;
  };
  const { data: Users } = useQuery({
    queryKey: [userId],
    queryFn: getUserData
  });

  const goToMyPage = () => {
    setSelectedIdx(null);
    router.push(`/mypage/${userId}`);
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
        <Image
          src="/alarm_chat.svg"
          alt="채팅 알림 아이콘"
          width={24}
          height={24}
          className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]"
        />
      </div>
      <div className="flex items-center gap-[24px] break-keep">
        <button onClick={goToMyPage} className="text-grey-500 hover:text-grey-700 text-[14px] lg:text-[16px]">
          <b className="text-primary-500 hover:text-primary-700">{Users?.data?.nickname}</b>님
        </button>
        <button onClick={handleLogout} className={clsx(buttonStyle, 'bg-grey-200 hover:bg-grey-300 text-white')}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
