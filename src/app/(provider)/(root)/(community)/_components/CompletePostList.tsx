'use client';

import { useEffect, useState } from 'react';
import Languages from './Languages';
import Latest from './Latest';
import Popularity from './Popularity';
import Link from 'next/link';

export default function CompletePostList() {
  const [view, setView] = useState<boolean>(true);
  // const [posts, setPosts] = useState<Post[]>([]);

  const handleListChange = () => {
    setView(!view);
  };

  return (
    <div className="flex gap-[32px] mt-[30px]">
      <Languages />
      <div className="w-[995px] gap-12 flex flex-col items-start sm:w-full">
        <Link href="/createPost" className="px-4 py-2 bg-black rounded-md text-white text-base ml-auto">
          질문 작성하기
        </Link>
        <div className="h-[40px] flex items-center gap-[24px]">
          <p onClick={() => handleListChange()} className={view ? 'font-black' : 'font-medium'}>
            최신 순
          </p>
          <p onClick={() => handleListChange()} className={!view ? 'font-black' : 'font-medium'}>
            인기 순
          </p>
        </div>
        <div>{view ? <Latest /> : <Popularity />}</div>
      </div>
    </div>
  );
}

// 질문 작성하기 버튼 통일해서 따로 컴포넌트 관리하게 되면 맞춰서 바꿈
