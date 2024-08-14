'use client';

import useSidebarStore from '@/zustand/sidebarStore';
import Image from 'next/image';

interface SearchBarProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}

export default function SearchBar({ searchInput, setSearchInput, handleSearch }: SearchBarProps) {
  const { searchBarClose } = useSidebarStore();

  return (
    <div className="md:hidden fixed top-0 z-20 py-[8px] px-[16px] flex gap-[8px] w-full h-[56px] items-center justify-center bg-white">
      <Image src="/closeBtnX.svg" alt="닫기" width={24} height={24} onClick={searchBarClose} />
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
  );
}
