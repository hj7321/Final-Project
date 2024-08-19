'use client';

import { useState } from 'react';
import QnaBookmarkList from './QnaBookmarkList';
import InsightBookmarkList from './InsightBookmarkList';
import RequestBookmarkList from './RequestBookmarkList';
import clsx from 'clsx';

const pages = [
  { name: 'Q&A', component: 'QnaBookmarkList' },
  { name: '인사이트', component: 'InsightBookmarkList' },
  { name: '전문가 의뢰', component: 'RequestBookmarkList' }
];

export default function MyBookmarkList() {
  const [activeBookmarkList, setActiveBookmarkList] = useState('QnaBookmarkList');

  const componentMapping: { [key: string]: JSX.Element } = {
    QnaBookmarkList: <QnaBookmarkList />,
    InsightBookmarkList: <InsightBookmarkList />,
    RequestBookmarkList: <RequestBookmarkList />
  };

  const renderComponent = (activeComponent: string): JSX.Element => {
    return componentMapping[activeComponent];
  };

  return (
    <div className="w-full">
      <div className="hidden md:flex">찜한 목록</div>
      <div className="flex mt-3 md:mt-12 justify-start font-medium font-grey-700 text-xl">
        {pages.map((page) => (
          <span key={page.name}>
            <button
              className={clsx(
                'mx-2',
                activeBookmarkList === page.component
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-400'
              )}
              onClick={() => setActiveBookmarkList(page.component)}
            >
              {page.name}
            </button>
          </span>
        ))}
      </div>
      <div>{renderComponent(activeBookmarkList)}</div>
    </div>
  );
}
