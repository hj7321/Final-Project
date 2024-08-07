'use client';

import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const buttonStyle = 'w-[220px] h-[37px] px-[16px] py-[8px] rounded-[8px] text-center';
const linkStyle = 'flex justify-between px-[12px] py-[8px]';

interface HamburgerProp {
  onClose: () => void;
}

export default function Hamburger({ onClose }: HamburgerProp) {
  const { isLogin, userId } = useAuthStore();
  const router = useRouter();

  const getUserData = async () => {
    const supabase = createClient();
    const data = await supabase.from('Users').select('*').eq('id', userId!).maybeSingle();
    return data;
  };
  const { data: Users } = useQuery({
    queryKey: [userId],
    queryFn: getUserData
  });

  const goToLoginPage = () => {
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPage', pagePathname);
    router.push('/login');
    onClose();
  };

  const goToSignUpPage = () => {
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPage', pagePathname);
    router.push('/signup');
    onClose();
  };

  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <section
      className="fixed top-0 left-0 z-50 w-[252px] min-h-screen flex flex-col bg-white py-[24px] px-[16px]"
      onClick={handleSectionClick}
    >
      <div className="h-[344px] flex flex-col">
        <Image
          src="/logo_eng.svg"
          alt="영어 로고"
          width={120}
          height={24}
          className={clsx(isLogin ? 'mb-[24px]' : 'mb-[32px]')}
        />
        {isLogin ? (
          <div className="flex items-center mb-[24px] py-[8px]">
            <Image src="/defaultProfileimg.svg" alt="기본 프로필" width={63} height={63} className="mr-[16px]" />
            <p>
              <b>{Users?.data?.nickname}</b>님
            </p>
            <Image src="/alarm_comment.svg" alt="댓글 알림 아이콘" width={24} height={24} />
            <Image src="/alarm_chat.svg" alt="채팅 알림 아이콘" width={24} height={24} />
          </div>
        ) : (
          <div className="flex flex-col gap-[8px] mb-[24px]">
            <button
              onClick={goToLoginPage}
              className={clsx(
                buttonStyle,
                'Caption1-M',
                'border border-primary-500 hover:bg-primary-50 text-primary-500'
              )}
            >
              로그인
            </button>
            <button
              onClick={goToSignUpPage}
              className={clsx(buttonStyle, 'Caption1-M', 'bg-primary-500 hover:bg-primary-700 text-white')}
            >
              회원가입
            </button>
          </div>
        )}
        <nav className="flex flex-col gap-[16px] mb-[24px]">
          <Link href="/qna" className={linkStyle} onClick={onClose}>
            <p>Q&A</p>
            <Image src="/arrow.svg" alt="화살표" width={21} height={21} />
          </Link>
          <Link href="/insight" className={linkStyle} onClick={onClose}>
            <p>인사이트</p>
            <Image src="/arrow.svg" alt="화살표" width={21} height={21} />
          </Link>
          <Link href="/pro" className={linkStyle} onClick={onClose}>
            <p>전문가 의뢰</p>
            <Image src="/arrow.svg" alt="화살표" width={21} height={21} />
          </Link>
        </nav>
      </div>
    </section>
  );
}
