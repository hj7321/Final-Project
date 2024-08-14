'use client';

import { useEffect, useState } from 'react';
import Languages from './Languages';
import Latest from './Latest';
import Popularity from './Popularity';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';
import Cookies from 'js-cookie';

export default function CompletePostList() {
  const pathname = usePathname();
  console.log(pathname);
  const { isLogin, userId } = useAuthStore();
  const router = useRouter();
  // const [view, setView] = useState<boolean>(true);
  // const [posts, setPosts] = useState<Post[]>([]);

  // const handleListChange = () => {
  //   setView(!view);
  // };

  const handleCheckLogin = () => {
    if (!isLogin) {
      alert('로그인 후 이용해주세요.');
      const presentPage = window.location.href;
      const pagePathname = new URL(presentPage).pathname;
      Cookies.set('returnPage', pagePathname);
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:gap-[32px] mt-[30px]">
      <Languages />
      <div className="mt-4 md:m-0 max-w-[995px] flex flex-col items-start w-full">
        <Link
          href="/createPost"
          className="px-4 py-2 bg-primary-500 text-white text-base ml-auto flex items-center justify-center	
            w-full md:w-auto md:rounded-[24px] rounded-[8px] mb-4 md:mb-8"
          onClick={handleCheckLogin}
        >
          <Image src="/pencil.svg" alt="pencilLogo" width={24} height={24} className="" />{' '}
          {pathname === '/qna' ? '질문 남기기' : '지식 공유하기'}
        </Link>
        {/* <div className="h-[40px] flex items-center gap-[24px]">
          <p onClick={() => handleListChange()} className={view ? 'font-black' : 'font-medium'}>
            최신 순
          </p>
          <p onClick={() => handleListChange()} className={!view ? 'font-black' : 'font-medium'}>
            인기 순
          </p>
        </div>
        <div>{view ? <Latest /> : <Popularity />}</div> */}
        <Latest />
      </div>
    </div>
  );
}

// 질문 작성하기 버튼 통일해서 따로 컴포넌트 관리하게 되면 맞춰서 바꿈
