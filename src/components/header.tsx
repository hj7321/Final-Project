'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './Sidebar';
import ChatNotification from './ChatNotification';

const buttonStyle = 'w-[100px] h-[40px] px-[16px] py-[8px] rounded-[8px] text-center';
const linkStyle = 'text-grey-700 hover:text-primary-500 hover:font-bold px-[12px] py-[8px]';

export default function Header() {
  const [searchInput, setSearchInput] = useState('');
  const [number, setNumber] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [session, setSession] = useState<string | null | undefined>(null);
  const router = useRouter();
  const { isLogin, logout, userId, initializeAuthState } = useAuthStore();

  // const searchParams = useSearchParams();
  // const currentIndex = searchParams.get('index');

  // useEffect(() => {
  //   if (currentIndex) setSelectedIdx(+currentIndex);
  //   else setSelectedIdx(null);
  // }, [currentIndex]);

  const pathname = usePathname();
  const isAuthPage = ['/login', '/login/confirmEmail', '/login/resetPassword', '/login/sendLink', '/signup'].includes(
    pathname
  );

  const supabase = createClient();

  useEffect(() => {
    const handleGetSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      console.log(session);
      setSession(session?.access_token);
    };
    handleGetSession();
  }, [supabase.auth]);

  useEffect(() => {
    const initialize = async () => {
      await initializeAuthState();
    };
    initialize();
  }, [initializeAuthState, session]);

  useEffect(() => {
    const num = Math.random() >= 0.5 ? 0 : 1;
    setNumber(num);
  }, []);

  const getUserData = async () => {
    const data = await supabase.from('Users').select('*').eq('id', userId!).maybeSingle();
    return data;
  };
  const { data: Users } = useQuery({
    queryKey: [userId],
    queryFn: getUserData
  });

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/search?query=${searchInput}`);
      setSearchInput('');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST'
    });
    logout();
    router.replace('/');
  };

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

  // const handleMovePage = (href: string, idx: number): void => {
  //   router.push(`${href}?index=${idx}`);
  // };

  return (
    <>
      <header
        className={clsx(
          'sticky top-0 z-40 flex h-[56px] md:h-[72px] px-[16px] md:px-[120px] py-[16px] border border-grey-100 bg-white',
          isAuthPage && 'hidden md:flex',
          sidebarOpen && 'bg-grey-900 bg-opacity-50'
        )}
      >
        <div className="w-full flex justify-between items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Image src="/hamburger.svg" alt="메뉴 아이콘" width={24} height={24} />
          </button>
          <Link href="/">
            <div className="w-40 h-16 flex items-center justify-center">
              {number === 0 ? (
                <Image src="/logo_eng.svg" alt="영어 로고" width={120} height={34} />
              ) : (
                <Image src="/logo_kor.svg" alt="한국어 로고" width={120} height={34} />
              )}
            </div>
          </Link>
          <Image src="/searchIcon.svg" alt="돋보기 아이콘" width={24} height={24} onClick={() => setSearchOpen(true)} />
        </div>

        <div className="w-full justify-between items-center hidden md:flex">
          <div className="flex items-center gap-[32px]">
            <Link href="/">
              <div className="w-40 h-16 flex items-center justify-center">
                {number === 0 ? (
                  <Image src="/logo_eng.svg" alt="영어 로고" width={165} height={55} />
                ) : (
                  <Image src="/logo_kor.svg" alt="한국어 로고" width={165} height={55} />
                )}
              </div>
            </Link>
            <nav className="ml-4 space-x-[12px]">
              <Link
                href="/qna"
                // onClick={() => handleMovePage('/qna', 0)}
                className={clsx(selectedIdx === 0 && 'text-primary-500 font-bold', linkStyle)}
              >
                Q&A
              </Link>
              <Link
                href="/insight"
                // onClick={() => handleMovePage('/insight', 1)}
                className={clsx(selectedIdx === 1 && 'text-primary-500 font-bold', linkStyle)}
              >
                인사이트
              </Link>
              <Link
                href="/pro"
                // onClick={() => handleMovePage('/pro', 2)}
                className={clsx(selectedIdx === 2 && 'text-primary-500 font-bold', linkStyle)}
              >
                전문가 의뢰
              </Link>
            </nav>
          </div>

          <div className="w-[340px] h-[40px] flex justify-between bg-grey-50 rounded-[20px] px-[16px] py-[8px]">
            <input
              type="text"
              placeholder="도움이 필요한 언어, 주제를 찾아보세요."
              className="bg-grey-50 outline-none w-[250px] h-[24px] placeholder-grey-200 placeholder:text-[15px] text-black text-[15px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>
              <Image src="/searchIcon.svg" alt="돋보기 아이콘" width={24} height={24} />
            </button>
          </div>
          {isLogin ? (
            <div className="flex items-center gap-[24px]">
              <div className="flex gap-[12px]">
                <Image src="/alarm_comment.svg" alt="댓글 알림 아이콘" width={24} height={24} />
                <Image src="/alarm_chat.svg" alt="채팅 알림 아이콘" width={24} height={24} />
              </div>
              <div className="flex items-center gap-[24px]">
                <Link href={`/mypage/${userId}`} className="text-grey-500 hover:text-grey-700">
                  <b className="text-primary-500 hover:text-primary-700">{Users?.data?.nickname}</b>님
                </Link>
                <button
                  onClick={handleLogout}
                  className={clsx(buttonStyle, 'bg-grey-200 hover:bg-grey-300 text-white')}
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-[16px] text-[16px]">
              <button
                onClick={goToLoginPage}
                className={clsx(buttonStyle, 'border border-primary-500 hover:bg-primary-50 text-primary-500')}
              >
                로그인
              </button>
              <button
                onClick={goToSignUpPage}
                className={clsx(buttonStyle, 'bg-primary-500 hover:bg-primary-700 text-white')}
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </header>
      {sidebarOpen && <Sidebar setSidebarOpen={setSidebarOpen} />}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-grey-900 bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {searchOpen && (
        <div className="md:hidden fixed top-0 z-50 py-[8px] px-[16px] flex gap-[8px] w-full h-[56px] items-center justify-center bg-white">
          <Image src="/closeBtnX.svg" alt="닫기" width={24} height={24} onClick={() => setSearchOpen(false)} />
          <div className="w-[90%] h-[40px] flex justify-between bg-grey-50 rounded-[20px] px-[16px] py-[8px]">
            <input
              type="text"
              placeholder="도움이 필요한 언어, 주제를 찾아보세요."
              className="bg-grey-50 outline-none w-[250px] h-[24px] placeholder-grey-200 placeholder:text-[12px] md:placeholder:text-[14px] text-black text-[13px] md:text-[15px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>
              <Image src="/searchIcon.svg" alt="돋보기 아이콘" width={24} height={24} />
            </button>
          </div>
        </div>
      )}
      {searchOpen && <div className="md:hidden fixed inset-0" onClick={() => setSearchOpen(false)}></div>}
    </>
  );
}
