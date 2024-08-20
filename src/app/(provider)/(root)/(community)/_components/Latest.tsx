import { useState, useEffect } from 'react';
import { CommunityPosts } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import useAuthStore from '@/zustand/authStore';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import { CodeCategories } from '@/components/dumy';
import { BookmarkCount } from '../../mypage/[id]/_components/BookmarkCount';

const btnSt = 'w-[32px] h-[32px] text-white text-[16pt] flex items-center justify-center rounded-[4px]';

export default function Latest() {
  const { userId } = useAuthStore();
  const pathname = usePathname().split('/')[1];
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const postsPerPage = 7;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

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

  const getCommentCount = async (postId: string) => {
    const supabase = createClient();
    const { count } = await supabase
      .from('Community Comments')
      .select('*', { count: 'exact' })
      .eq('community_post_id', postId);
    return count;
  };

  const { data: commentCounts, isLoading: commentsLoading } = useQuery({
    queryKey: ['commentCounts', posts],
    queryFn: async () => {
      if (!posts) return [];
      const counts = await Promise.all(posts.map((post) => getCommentCount(post.id)));
      return counts;
    },
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

  if (isLoading || commentsLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(currentPosts);

  return (
    <>
      <div className="flex flex-col gap-[24px] w-full">
        {currentPosts &&
          currentPosts.map((post, index) => (
            <div key={post.id}>
              <Link href={`/${post.post_category.toLowerCase()}/${post.id}`}>
                <div className="flex px-[32px] py-[24px] border border-[#D9d9d9] rounded-[16px] gap-[24px]">
                  {post?.post_img?.[0] && (
                    <Image
                      src={post.post_img[0]}
                      alt="Post Image"
                      width={186}
                      height={186}
                      className="rounded-[8px] w-[186px] h-[186px] "
                    />
                    //모바일 sm:w-[72px] sm:h-[72px]
                    // 미리보기 이미지 찌그러짐 현상
                  )}
                  <div className="flex flex-col gap-4 w-full overflow-hidden">
                    <div className="flex gap-[12px] line-clamp-1">
                      {post.lang_category?.map((category, index) => {
                        const categoryData = CodeCategories.find((cat) => cat.name === category);
                        return (
                          <div key={index} className="flex gap-[9px]">
                            {categoryData && (
                              <Image
                                src={categoryData.image}
                                alt={category}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            )}
                            <p className=" text-grey-600">{category}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="font-black text-gray-800 text-[16px]">{post.title}</h1>
                      <div
                        className="font-medium text-[16px] text-gray-600 w-full h-[48px] overflow-hidden text-ellipsis line-clamp-2"
                        data-color-mode="light"
                      >
                        <MDEditor.Markdown source={post.content} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-[12px] text-grey-400">{getUserNickname(post.user_id)}</p>
                      <div className="flex justify-between	items-center">
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                            <Image src="/comment.svg" alt="" width={16} height={16} className="w-[16px] h-[16px]" />
                            <p className="font-medium text-[12px] text-grey-400">{commentCounts?.[index] ?? 0}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/bookmark_dark.svg"
                              alt=""
                              width={16}
                              height={16}
                              className="w-[16px] h-[16px]"
                            />
                            <p className="font-medium text-[12px] text-grey-400">
                              <BookmarkCount postId={post.id} />
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-[12px] text-grey-400">{post?.created_at.split('T')[0]}</p>
                      </div>
                    </div>
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
              className={`${btnSt} ${
                currentPage === index + 1 ? 'bg-primary-500' : 'bg-grey-100'
              } w-[32px] h-[32px] rounded-lg`}
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
