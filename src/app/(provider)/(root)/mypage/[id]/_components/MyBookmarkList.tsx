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
      <div className="hidden md:flex font-bold text-[24px]">찜한 목록</div>
      <div className="flex gap-[8px] px-[16px] py-[8px] md:p-[0px] md:gap-[12px] mt-3 md:mt-12 justify-start font-medium font-grey-700 text-xl">
        {pages.map((page) => (
          <span key={page.name}>
            <button
              className={clsx(
                'rounded-[20px] md:rounded-[0px] px-[16px] py-[8px] md:px-[12px] text-[12px] md:text-[16px]',
                activeBookmarkList === page.component
                  ? 'bg-primary-500 md:bg-white font-bold text-white md:text-primary-500 md:border-b-2 md:border-primary-500'
                  : 'bg-grey-50 md:bg-white text-grey-400'
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
