'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';

const buttonStyle = 'w-[100px] h-[40px] px-[16px] py-[8px] rounded-[8px] text-center';
const linkStyle = 'text-grey-700 hover:text-primary-500 hover:font-bold px-[12px] py-[8px]';

export default function Header() {
  const [searchInput, setSearchInput] = useState('');
  const [number, setNumber] = useState<number>(0);
  const [session, setSession] = useState<string | null | undefined>(null);
  const router = useRouter();
  const { isLogin, logout, userId, initializeAuthState } = useAuthStore();

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

  return (
    <header className="sticky top-0 z-50 bg-white h-[72px] flex items-center justify-between px-[120px] py-[16px] border border-grey-100 hidden">
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
          <Link href="/qna" className={linkStyle}>
            Q&A
          </Link>
          <Link href="/insight" className={linkStyle}>
            인사이트
          </Link>
          <Link href="/pro" className={linkStyle}>
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
      {/* <Suspense fallback={<div>로딩중</div>}>
        <HeaderButton />
      </Suspense> */}
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
            <button onClick={handleLogout} className={clsx(buttonStyle, 'bg-grey-200 hover:bg-grey-300 text-white')}>
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
    </header>
  );
}
