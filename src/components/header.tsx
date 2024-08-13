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

const buttonStyle =
  'w-[75px] h-[30px] lg:w-[100px] lg:h-[40px] px-[16px] py-[8px] rounded-[8px] text-center text-[12px] lg:text-[16px] flex items-center justify-center';
const linkStyle =
  'text-grey-700 hover:text-primary-500 hover:font-bold lg:px-[12px] lg:py-[8px] items-center text-[14px] lg:text-[16px]';

export default function Header() {
  const [searchInput, setSearchInput] = useState('');
  const [number, setNumber] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [session, setSession] = useState<string | null | undefined>(null);

  const { isLogin, logout, userId, initializeAuthState } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  const hideLayoutPatterns = ['/login', '/signup'];

  const hideLayout = hideLayoutPatterns.some((pattern) => pathname.startsWith(pattern));

  useEffect(() => {
    if (pathname.startsWith('/qna')) setSelectedIdx(0);
    else if (pathname.startsWith('/insight')) setSelectedIdx(1);
    else if (pathname.startsWith('/pro')) setSelectedIdx(2);
    // else setSelectedIdx(null)
  }, [pathname]);

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
    setSelectedIdx(null);
    if (searchInput.trim()) {
      router.push(`/search?query=${searchInput}`);
      setSearchInput('');
    }
  };

  const handleLogout = async () => {
    setSelectedIdx(null);
    await fetch('/api/logout', {
      method: 'POST'
    });
    logout();
    router.replace('/');
  };

  const goToHomePage = () => {
    setSelectedIdx(null);
    router.push('/');
  };

  const goToMyPage = () => {
    setSelectedIdx(null);
    router.push(`/mypage/${userId}`);
  };

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
    <>
      <header
        className={clsx(
          'sticky top-0 z-10 flex h-[56px] md:h-[72px] px-[16px]   py-[16px] border-b border-grey-100 bg-white',
          hideLayout && 'hidden md:flex',
          sidebarOpen && 'bg-grey-900 bg-opacity-50'
        )}
      >
        <div className="md:max-w-[1200px] w-full mx-auto flex items-center">
          {/* 모바일용 헤더 - 햄버거 아이콘(왼쪽), 로고(가운데), 돋보기 아이콘(오른쪽) */}
          <div className="w-full flex justify-between items-center md:hidden">
            <Image src="/hamburger.svg" alt="메뉴 아이콘" width={24} height={24} onClick={() => setSidebarOpen(true)} />
            <Link href="/">
              <div className="w-40 h-16 flex items-center justify-center">
                {number === 0 ? (
                  <Image src="/logo_eng.svg" alt="영어 로고" width={120} height={34} />
                ) : (
                  <Image src="/logo_kor.svg" alt="한국어 로고" width={120} height={34} />
                )}
              </div>
            </Link>
            <Image
              src="/searchIcon.svg"
              alt="돋보기 아이콘"
              width={24}
              height={24}
              onClick={() => setSearchOpen(true)}
            />
          </div>

          {/* 데스크톱용 헤더 */}
          <div className="w-full hidden md:flex justify-between items-center gap-[32px]">
            {/* 왼쪽: 로고, 카테고리(Q&A, 인사이트, 전문가 의뢰) */}
            <div className="flex items-center gap-[20px] lg:gap-[32px] flex-shrink-0">
              <button onClick={goToHomePage} className="flex-shrink-0 grow-0 w-fit h-fit">
                <div className="flex items-center justify-center">
                  {number === 0 ? (
                    <Image
                      src="/logo_eng.svg"
                      alt="영어 로고"
                      width={150}
                      height={50}
                      className="w-[105px] h-[35px] lg:w-[150px] lg:h-[50px]"
                    />
                  ) : (
                    <Image
                      src="/logo_kor.svg"
                      alt="한국어 로고"
                      width={150}
                      height={50}
                      className="w-[105px] h-[35px] lg:w-[150px] lg:h-[50px]"
                    />
                  )}
                </div>
              </button>
              <nav className="flex items-center gap-[12px] text-[12px] lg:text-[16px] whitespace-nowrap">
                <Link
                  href="/qna"
                  onClick={() => setSelectedIdx(0)}
                  className={clsx(selectedIdx === 0 && 'text-primary-500 font-bold', linkStyle)}
                >
                  Q&A
                </Link>
                <Link
                  href="/insight"
                  onClick={() => setSelectedIdx(1)}
                  className={clsx(selectedIdx === 1 && 'text-primary-500 font-bold', linkStyle)}
                >
                  인사이트
                </Link>
                <Link
                  href="/pro"
                  onClick={() => setSelectedIdx(2)}
                  className={clsx(selectedIdx === 2 && 'text-primary-500 font-bold', linkStyle)}
                >
                  전문가 의뢰
                </Link>
              </nav>
            </div>

            {/* 가운데: 검색창 */}
            <div className="w-[300px] lg:w-[340px] h-[40px] flex items-center justify-between bg-grey-50 rounded-[20px] px-[16px] py-[8px] grow-0">
              <input
                type="text"
                placeholder="도움이 필요한 언어, 주제를 찾아보세요."
                className="bg-grey-50 outline-none w-[200px] lg:w-[250px] lg:h-[24px] placeholder-grey-200 placeholder:text-[12px] lg:placeholder:text-[15px] text-black text-[15px]"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>
                <Image
                  src="/searchIcon.svg"
                  alt="돋보기 아이콘"
                  width={24}
                  height={24}
                  className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]"
                />
              </button>
            </div>

            {/* 오른쪽 */}
            {/* 비로그인 시: 검색창, 로그인 버튼, 로그아웃 버튼 */}
            {/* 로그인 시: 검색창, 알림 아이콘, 닉네임, 로그아웃 버튼 */}
            {isLogin ? (
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
        </div>
      </header>
      {sidebarOpen && <Sidebar setSidebarOpen={setSidebarOpen} />}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-grey-900 bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {searchOpen && (
        <div className="md:hidden fixed top-0 z-20 py-[8px] px-[16px] flex gap-[8px] w-full h-[56px] items-center justify-center bg-white">
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
