'use client';

import { useState } from 'react';
import BookMark from './BookMark';
import AccountList from './AccountList';
import MyCommentList from './MyCommentList';
import MyPostList from './MyPostList';
import Portfolio from './Portfolio';

export default function AllMypage() {
  const [activeComponent, setActiveComponent] = useState('BookMark');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'BookMark':
        return <BookMark />;
      case 'AccountList':
        return <AccountList />;
      case 'MyCommentList':
        return <MyCommentList />;
      case 'MyPostList':
        return <MyPostList />;
      case 'Portfolio':
        return <Portfolio />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-[80%] m-auto bg-white ">
      <div className="flex flex-1">
        <aside className="w-64  p-4">
          <div className="flex flex-col items-center mb-6  border bg-main p-4 rounded">
            <div className="w-24 h-24 bg-black rounded-full mb-4"></div>
            <div className="text-black font-bold  mb-4">닉네임</div>

            <button className="mb-2 px-4 py-2 text-black rounded border bg-white">프로필 수정하기</button>
            <button className="px-4 py-2 text-black rounded border bg-white">전문가로 전환</button>
          </div>
          <ul className="space-y-4 mb-[10px] ">
            <li className="text-gray-700  cursor-pointer" onClick={() => setActiveComponent('BookMark')}>
              찜한 목록
            </li>
            <li className="text-gray-700  cursor-pointer" onClick={() => setActiveComponent('MyPostList')}>
              내가 쓴 글
            </li>
            <li className="text-gray-700  cursor-pointer" onClick={() => setActiveComponent('MyCommentList')}>
              내가 쓴 댓글
            </li>
            <li className="text-gray-700  cursor-pointer" onClick={() => setActiveComponent('Portfolio')}>
              포트폴리오 수정
            </li>
            <li className="text-gray-700  cursor-pointer" onClick={() => setActiveComponent('AccountList')}>
              거래내역
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-8 border border-main">
          <h1 className="flex mx-[40%] text-2xl font-bold mt-[40px] w-full ">{renderComponent()}</h1>
        </main>
      </div>
    </div>
  );
}
