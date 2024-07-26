'use client';

import { useEffect, useState } from 'react';
import Languages from './Languages';
import Latest from './Latest';
import Popularity from './Popularity';

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  post_category: string;
  user_id: string;
  post_img: string[];
  lang_category: string[];
}

export default function CompletePostList() {
  const [view, setView] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleListChange = () => {
    setView(!view);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);
  // 일단 잘 모르겠는데 작성함

  return (
    <div className="flex gap-[32px] mt-[30px]">
      <Languages />
      <div className="w-[995px] h-[840px] gap-12 flex flex-col items-start">
        <button className="px-4 py-2 bg-black rounded-md text-white text-base ml-auto">질문 작성하기</button>
        <div className="h-[40px] flex items-center gap-[24px]">
          <p onClick={() => handleListChange()} className={view ? 'font-black' : 'font-medium'}>
            최신 순
          </p>
          <p onClick={() => handleListChange()} className={!view ? 'font-black' : 'font-medium'}>
            인기 순
          </p>
        </div>
        <div>{view ? <Latest posts={posts} /> : <Popularity posts={posts} />}</div>
      </div>
    </div>
  );
}

// 질문 작성하기 버튼 통일해서 따로 컴포넌트 관리하게 되면 맞춰서 바꿈
