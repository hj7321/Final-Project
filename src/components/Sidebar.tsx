'use client';

import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AppInfoSidebar from './AppInfoSidebar';

const buttonStyle = 'w-[220px] h-[37px] px-[16px] py-[8px] rounded-[8px] text-center';
const linkStyle = 'flex justify-between px-[12px] py-[8px]';

interface SidebarProp {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ setSidebarOpen }: SidebarProp) {
  const [appInfoOpen, setAppInfoOpen] = useState<boolean>(false);
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

  const goToLoginPage = (e: React.MouseEvent) => {
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPage', pagePathname);
    router.push('/login');
    setSidebarOpen((prev) => !prev);
  };

  const goToSignUpPage = (e: React.MouseEvent) => {
    const presentPage = window.location.href;
    const pagePathname = new URL(presentPage).pathname;
    Cookies.set('returnPage', pagePathname);
    router.push('/signup');
    setSidebarOpen((prev) => !prev);
  };

  const handleMovePage = (e: React.MouseEvent, href: string) => {
    router.push(href);
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <section className="md:hidden fixed top-0 left-0 z-30 w-[252px] min-h-screen flex flex-col bg-white py-[24px] px-[16px]">
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
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
                <div className="flex flex-col gap-[8px]">
                  <button onClick={(e) => handleMovePage(e, `/mypage/${userId}`)}>
                    <b className="text-primary-500">{Users?.data?.nickname}</b>님
                  </button>
                  <div className="flex gap-[12px]">
                    <Image src="/alarm_comment.svg" alt="댓글 알림 아이콘" width={24} height={24} />
                    <Image src="/alarm_chat.svg" alt="채팅 알림 아이콘" width={24} height={24} />
                  </div>
                </div>
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
              <button className={clsx(linkStyle, 'Caption1-L')} onClick={(e) => handleMovePage(e, '/qna')}>
                <p>Q&A</p>
                <Image src="/arrow.svg" alt="화살표" width={20} height={20} />
              </button>
              <button className={clsx(linkStyle, 'Caption1-L')} onClick={(e) => handleMovePage(e, '/insight')}>
                <p>인사이트</p>
                <Image src="/arrow.svg" alt="화살표" width={20} height={20} />
              </button>
              <button className={clsx(linkStyle, 'Caption1-L')} onClick={(e) => handleMovePage(e, '/pro')}>
                <p>전문가 의뢰</p>
                <Image src="/arrow.svg" alt="화살표" width={20} height={20} />
              </button>
            </nav>
          </div>
        </div>
        <div
          className={clsx(
            !isLogin && 'hidden',
            'flex flex-col gap-[16px] text-grey-400 self-start pl-[12px]',
            'Caption2-M'
          )}
        >
          <button onClick={() => setAppInfoOpen(true)} className="mb-[20px]">
            코듀 앱 정보
          </button>
        </div>
      </section>
      {appInfoOpen && <AppInfoSidebar setAppInfoOpen={setAppInfoOpen} setSidebarOpen={setSidebarOpen} />}
    </>
  );
}
