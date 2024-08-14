'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import LoginHeader from './LoginHeader';
import LogoutHeader from './LogoutHeader';
import useIndexStore from '@/zustand/indexStore';

const linkStyle =
  'text-grey-700 hover:text-primary-500 hover:font-bold lg:px-[12px] lg:py-[8px] items-center text-[14px] lg:text-[16px]';

interface DesktopHeaderProps {
  number: number;
  nickname: string | null | undefined;
  isLogin: boolean;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}

export default function DesktopHeader({
  number,
  nickname,
  isLogin,
  searchInput,
  setSearchInput,
  handleSearch
}: DesktopHeaderProps) {
  const { selectedIdx } = useIndexStore();

  return (
    <div className="w-full hidden md:flex justify-between items-center gap-[32px]">
      {/* 왼쪽: 로고, 카테고리(Q&A, 인사이트, 전문가 의뢰) */}
      <div className="flex items-center gap-[20px] lg:gap-[32px] flex-shrink-0">
        <Link href="/" className="flex-shrink-0 grow-0 w-fit h-fit">
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
        </Link>
        <nav className="flex items-center gap-[12px] text-[12px] lg:text-[16px] whitespace-nowrap">
          <Link href="/qna" className={clsx(selectedIdx === 0 && 'text-primary-500 font-bold', linkStyle)}>
            Q&A
          </Link>
          <Link href="/insight" className={clsx(selectedIdx === 1 && 'text-primary-500 font-bold', linkStyle)}>
            인사이트
          </Link>
          <Link href="/pro" className={clsx(selectedIdx === 2 && 'text-primary-500 font-bold', linkStyle)}>
            전문가 의뢰
          </Link>
        </nav>
      </div>

      {/* 가운데: 검색창 */}
      <div className="min-w-[250px] lg:w-[340px] h-[40px] flex items-center justify-between bg-grey-50 rounded-[20px] px-[16px] py-[8px] grow-0">
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
      {isLogin ? <LoginHeader nickname={nickname} /> : <LogoutHeader />}
    </div>
  );
}
