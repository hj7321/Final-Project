'use client';

import { useState } from 'react';
import QnaPostList from './QnaPostList';
import InsightPostList from './InsightPostList';

export default function MyPostList() {
  const [activePostList, setActivePostList] = useState('QnaPostList');

  const renderPostList = () => {
    switch (activePostList) {
      case 'QnaPostList':
        return <QnaPostList />;
      case 'InsightPostList':
        return <InsightPostList />;
    }
  };
  const isClicked = (postList: string) => (activePostList === postList ? 'text-primary-500' : 'text-gray-400');

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <span>
          <button className={`mx-2  ${isClicked('QnaPostList')}`} onClick={() => setActivePostList('QnaPostList')}>
            QnA
          </button>
        </span>

        <span>
          <button
            className={`mx-2  ${isClicked('InsightPostList')}`}
            onClick={() => setActivePostList('InsightPostList')}
          >
            Insight
          </button>
        </span>
      </div>
      <div>{renderPostList()}</div>
    </div>
  );
}
