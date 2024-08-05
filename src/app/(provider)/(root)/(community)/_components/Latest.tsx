import { useState, useEffect } from 'react';
import { CommunityPosts } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const btnSt = 'w-[32px] h-[32px] text-white text-[16pt] flex items-center justify-center rounded-[4px]';
// 페이지네이션 적용 후에, 조건부 서식 걸리도록 bg 다시 제어해야 함 선택되지 않은 버튼은 #D2D2D2 으로 처리

export default function Latest() {
  const { userId } = useAuthStore();
  const pathname = usePathname().split('/')[1];
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7; // 한 페이지에 보여줄 게시물 수

  const getPosts = async (): Promise<CommunityPosts[]> => {
    const response = await fetch('/api/communityReadLatest');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();
    const filteredData = data.filter((post) => post.post_category.toLowerCase() === pathname);
    return filteredData;
  };

  const getUsersData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('Users').select('*');
    return data;
  };

  const {
    data: posts,
    isLoading,
    error
  } = useQuery<CommunityPosts[]>({
    queryKey: ['post', pathname],
    queryFn: getPosts
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsersData,
    enabled: !!posts
  });

  const getUserNickname = (userId: string) => {
    const user = users?.find((user) => user.id === userId);
    return user ? user.nickname : 'Unknown';
  };

  // 현재 페이지의 게시물 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = posts ? Math.ceil(posts.length / postsPerPage) : 0;

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex flex-col gap-[24px]">
        {currentPosts &&
          currentPosts.map((post) => (
            <div key={post.id}>
              <Link href={`/${post.post_category.toLowerCase()}/${post.id}`}>
                <div className="flex flex-col gap-[24px] p-[32px] px-[24px] border border-[#D9d9d9] rounded-[16px]">
                  <h1 className="font-black text-[20px]">{post.title}</h1>
                  <p className="font-medium text-[16px] w-[995px] h-[45px] overflow-hidden text-ellipsis line-clamp-2">
                    {post.content}
                  </p>
                  <p className="font-medium text-[16px]">{getUserNickname(post.user_id)}</p>
                </div>
              </Link>
            </div>
          ))}
      </div>
      <div className="mt-12 flex gap-[8px]">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`${btnSt} ${currentPage === index + 1 ? 'bg-[#585858]' : 'bg-[#D2D2D2]'}`}
            onClick={() => handleClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}
