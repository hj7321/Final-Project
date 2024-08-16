'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Sidebar from './mobile/Sidebar';
import MobileHeader from './mobile/MobileHeader';
import DesktopHeader from './desktop/DesktopHeader';
import SearchBar from './mobile/SearchBar';
import useIndexStore from '@/zustand/indexStore';
import useSidebarStore from '@/zustand/sidebarStore';

interface HeaderProps {
  isLogin: boolean;
  nickname: string | null | undefined;
}

export default function Header({ isLogin, nickname }: HeaderProps) {
  const [searchInput, setSearchInput] = useState<string>('');
  const [number, setNumber] = useState<number>(0);

  const { setSelectedIdx } = useIndexStore();
  const { isSidebarOpened, sidebarClose, isSearchBarOpened, searchBarClose } = useSidebarStore();

  const router = useRouter();

  const pathname = usePathname();
  const hideLayoutPatterns = ['/login', '/signup'];
  const hideLayout = hideLayoutPatterns.some((pattern) => pathname.startsWith(pattern));

  // URL에 경로 입력했을 때에도 카테고리 색이 반영되도록 함
  useEffect(() => {
    if (pathname.startsWith('/qna')) setSelectedIdx(0);
    else if (pathname.startsWith('/insight')) setSelectedIdx(1);
    else if (pathname.startsWith('/pro')) setSelectedIdx(2);
    else setSelectedIdx(null);
  }, [pathname, setSelectedIdx]);

  // 랜덤 숫자가 0.5 이상이면 0(영어 로고), 아니면 1(한국어 로고)이 되도록 함
  useEffect(() => {
    const num = Math.random() >= 0.5 ? 0 : 1;
    setNumber(num);
  }, []);

  const handleSearch = () => {
    setSelectedIdx(null);
    if (searchInput.trim()) {
      router.push(`/search?query=${searchInput}`);
      setSearchInput('');
    }
  };

  console.log(hideLayout);
  console.log(isSidebarOpened);

  return (
    <>
      <header
        className={clsx(
          'sticky top-0 z-10 flex h-[56px] md:h-[72px] px-[16px] py-[16px] border-b border-grey-100 bg-white',
          hideLayout && 'hidden md:flex',
          isSidebarOpened && 'bg-grey-900 bg-opacity-50'
        )}
      >
        <div className="md:max-w-[1200px] w-full mx-auto flex items-center">
          <MobileHeader number={number} />
          <DesktopHeader
            number={number}
            nickname={nickname}
            isLogin={isLogin}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
          />
        </div>
      </header>
      {isSidebarOpened && <Sidebar nickname={nickname} />}
      {isSidebarOpened && (
        <div className="md:hidden fixed inset-0 bg-grey-900 bg-opacity-50 z-20" onClick={sidebarClose}></div>
      )}
      {isSearchBarOpened && (
        <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} handleSearch={handleSearch} />
      )}
      {isSearchBarOpened && <div className="md:hidden fixed inset-0" onClick={searchBarClose}></div>}
    </>
  );
}
