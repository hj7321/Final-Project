'use client';

import useSidebarStore from '@/zustand/sidebarStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileHeaderProp {
  number: number;
}

export default function MobileHeader({ number }: MobileHeaderProp) {
  const { sidebarOpen, searchBarOpen } = useSidebarStore();
  const pathname = usePathname()

  const showBackIcon =
    pathname !== '/insight' &&
    pathname !== '/qna' &&
    pathname !== '/pro' &&
    pathname !== '/' &&
    !pathname.startsWith('/mypage');
  return (
    <div className="w-full flex justify-between items-center md:hidden">
    { showBackIcon ? (
      <Image
        src="/backIcon.svg" 
        alt="뒤로가기 아이콘"
        width={24}
        height={24}
        onClick={() => window.history.back()} 
      />
    ) : (
      <Image
        src="/hamburger.svg"
        alt="메뉴 아이콘"
        width={24}
        height={24}
        onClick={sidebarOpen}
      />
    )}
    <Link href="/">
      <div className="w-40 h-16 flex items-center justify-center">
        {number === 0 ? (
          <Image src="/logo_eng.svg" alt="영어 로고" width={120} height={34} />
        ) : (
          <Image src="/logo_kor.svg" alt="한국어 로고" width={120} height={34} />
        )}
      </div>
    </Link>
    <Image src="/searchIcon.svg" alt="돋보기 아이콘" width={24} height={24} onClick={searchBarOpen} />
  </div>
  );
}
