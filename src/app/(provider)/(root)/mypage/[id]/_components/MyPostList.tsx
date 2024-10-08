'use client';

import { useState } from 'react';
import QnaPostList from './QnaPostList';
import InsightPostList from './InsightPostList';
import RequestPostList from './RequestPostList';

export default function MyPostList() {
  const [activePostList, setActivePostList] = useState('QnaPostList');

  const renderPostList = () => {
    switch (activePostList) {
      case 'QnaPostList':
        return <QnaPostList />;
      case 'InsightPostList':
        return <InsightPostList />;
      case 'RequestPostList':
        return <RequestPostList />;
    }
  };
  const isClicked = (postList: string) =>
    activePostList === postList ? 'text-primary-500 border-b-2 border-primary-500' : 'text-grey-400';

  return (
    <div className="w-full">
      <div className="hidden md:flex font-bold text-[24px]">내가 쓴 글</div>
      <div className="flex mt-3 md:mt-12 justify-start font-medium font-grey-700 text-xl">
        <span>
          <button className={`mx-2  ${isClicked('QnaPostList')}`} onClick={() => setActivePostList('QnaPostList')}>
            Q&A
          </button>
        </span>

        <span>
          <button
            className={`mx-2  ${isClicked('InsightPostList')}`}
            onClick={() => setActivePostList('InsightPostList')}
          >
            인사이트
          </button>
        </span>
        <span>
          <button
            className={`mx-2  ${isClicked('RequestPostList')}`}
            onClick={() => setActivePostList('RequestPostList')}
          >
            전문가 의뢰
          </button>
        </span>
      </div>
      <div>{renderPostList()}</div>
    </div>
  );
}
