import { useState, useEffect } from 'react';
import { CommunityPosts } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';

const btnSt = 'w-[32px] h-[32px] text-white text-[16pt] flex items-center justify-center rounded-[4px]';

export default function Latest() {
  const { userId } = useAuthStore();
  const pathname = usePathname().split('/')[1];
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const postsPerPage = 7;

  useEffect(() => {
    // 화면 크기에 따라 모바일 여부 판단
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px 이하이면 모바일로 간주
    };

    handleResize(); // 초기 로드 시 실행
    window.addEventListener('resize', handleResize); // 화면 크기 변경 시 실행

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = isMobile ? posts : posts?.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = posts ? Math.ceil(posts.length / postsPerPage) : 0;

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex flex-col gap-[24px] w-full md:w-[944px]">
        {currentPosts &&
          currentPosts.map((post) => (
            <div key={post.id}>
              <Link href={`/${post.post_category.toLowerCase()}/${post.id}`}>
                <div className="flex p-[32px] px-[24px] border border-[#D9d9d9] rounded-[16px]  gap-[24px]">
                  {post?.post_img?.[0] && (
                    <Image
                      src={post.post_img[0]}
                      alt="Post Image"
                      width={186}
                      height={160}
                      className="rounded-[8px] w-[186px] h-[160px] sm:w-[72px] sm:h-[72px]"
                    />
                  )}
                  <div className="flex flex-col gap-[24px] ">
                    <h1 className="font-black text-[20px]">{post.title}</h1>
                    <div className="font-medium text-[16px] w-full h-[45px] overflow-hidden text-ellipsis line-clamp-2">
                      <MDEditor.Markdown source={post.content} />
                    </div>
                    <p className="font-medium text-[16px]">{getUserNickname(post.user_id)}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
      {!isMobile && (
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
      )}
    </>
  );
}
