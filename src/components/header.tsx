'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/zustand/authStore';
import clsx from 'clsx';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const buttonStyle = 'w-[100px] h-[40px] px-[16px] py-[8px] rounded-[8px] text-center';

export default function Header() {
  const [searchInput, setSearchInput] = useState('');
  const [number, setNumber] = useState<number>(0);
  const [session, setSession] = useState<string | null | undefined>(null);
  const router = useRouter();
  const { isLogin, logout, userId, userData, initializeAuthState, isLoading } = useAuthStore();

  const supabase = createClient();
  console.log('헤더');

  useEffect(() => {
    const handleGetSession = async () => {
      console.log('함수 호출');
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

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/search?query=${searchInput}`);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST'
    });
    logout();
    router.replace('/');
  };

  return (
    <header className="sticky top-0 bg-white h-[72px] flex items-center justify-between px-[120px] py-[16px] box-border">
      <div className="flex items-center gap-[32px]">
        <Link href="/">
          <div className="w-40 h-16 flex items-center justify-center">
            {number === 0 ? (
              <Image src="/engLogo.svg" alt="영어로고" width={120} height={40} />
            ) : (
              <Image src="/korLogo.svg" alt="한국어로고" width={120} height={40} />
            )}
          </div>
        </Link>
        <nav className="ml-4 space-x-[12px]">
          <a href="#" className="text-grey-700 px-[12px] py-[8px]">
            Q&A
          </a>
          <a href="#" className="text-grey-700 px-[12px] py-[8px]">
            인사이트
          </a>
          <Link href="/pro" className="text-grey-700 px-[12px] py-[8px]">
            전문가 의뢰
          </Link>
        </nav>
      </div>

      {/* 검색창 */}
      <div className="w-[340px] h-[40px] flex justify-between bg-grey-50 rounded-[20px] px-[16px] py-[8px]">
        <input
          type="text"
          placeholder="도움이 필요한 언어, 주제를 찾아보세요."
          className="bg-grey-50 outline-none w-[238px] h-[24px] placeholder-grey-200 placeholder:text-[13px] text-black text-[15px]"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>
          <Image src="/searchIcon.svg" alt="돋보기 아이콘" width={24} height={24} />
        </button>
      </div>

      {/* 로그인 및 회원가입 */}
      {/* <HeaderButton /> */}
      {isLogin ? (
        <div className="flex items-center gap-[24px]">
          <div className="flex gap-[12px]">
            <Image src="/alarmIcon.svg" alt="알림 아이콘" width={24} height={24} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.25 20.5C9.25 20.5 10.097 21.5 12 21.5C13.903 21.5 14.75 20.5 14.75 20.5M5.68328 12.6334L3.72361 16.5528C3.39116 17.2177 3.87465 18 4.61803 18H19.382C20.1253 18 20.6088 17.2177 20.2764 16.5528L18.3167 12.6334C18.1084 12.2169 18 11.7575 18 11.2918V9C18 5.68629 15.3137 3 12 3V3C8.68629 3 6 5.68629 6 9V11.2918C6 11.7575 5.89156 12.2169 5.68328 12.6334Z"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex items-center gap-[24px]">
            <Link href={`/mypage/${userId}`}>
              {/* <b className="text-primary-500">{userData && userData.data?.nickname}</b>님 */}
              <b>{userData?.name || userData?.user_name}</b>님
            </Link>
            <button onClick={handleLogout} className={clsx(buttonStyle, 'bg-grey-200 hover:bg-grey-300 text-white')}>
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-[16px] text-[16px]">
          <Link
            href="/login"
            className={clsx(buttonStyle, 'border border-primary-500 hover:bg-primary-50 text-primary-500')}
          >
            로그인
          </Link>
          <Link href="/signup" className={clsx(buttonStyle, 'bg-primary-500 hover:bg-primary-700 text-white')}>
            회원가입
          </Link>
        </div>
      )}
    </header>
  );
}