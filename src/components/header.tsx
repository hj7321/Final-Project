'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/search?query=${searchInput}`);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      {/* 로고 */}
      <div className="flex items-center">
        <Link href="/">
          <div className="w-40 h-16 bg-black text-white flex items-center justify-center">
            <span className="text-lg">{`< CodeU />`}</span>
          </div>
        </Link>
        <nav className="ml-4 space-x-4">
          <a href="#" className="text-black">Q & A</a>
          <a href="#" className="text-black">인사이트</a>
          <Link href="/pro" className="text-black">전문가 의뢰</Link>
        </nav>
      </div>

      {/* 검색창 */}
      <div className="flex items-center bg-gray-200 rounded-full px-4 py-2">
        <input
          type="text"
          placeholder="도움이 필요한 언어, 주제를 찾아보세요."
          className="bg-gray-200 outline-none w-64"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M16.65 16.65A7.65 7.65 0 1116.65 1.35a7.65 7.65 0 010 15.3z"
            ></path>
          </svg>
        </button>
      </div>

      {/* 로그인 및 회원가입 */}
      <div className="flex items-center space-x-4">
        <Link href="/mypage/1" className="bg-black text-white px-4 py-2 rounded">로그인</Link>
        <Link href="/signup" className="border border-black text-black px-4 py-2 rounded">회원가입</Link>
      </div>
    </header>
  );
}
