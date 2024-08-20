'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookMark, CommunityPosts } from '@/types/type';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import useProfile from '@/hooks/useProfile';
import useAuthStore from '@/zustand/authStore';
import Cookies from 'js-cookie';
import { Confirm, Notify } from 'notiflix';
import { useState } from 'react';
import { CodeCategories } from '@/components/dumy';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

type BookmarkData = {
  data: BookMark[];
  count: number;
};

export default function CommuPost() {
  const { id: postId } = useParams();
  const { userId, isLogin } = useAuthStore();
  const pathname = usePathname();
  const category = pathname.split('/')[1];
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const getPost = async (): Promise<CommunityPosts> => {
    const response = await fetch('/api/communityRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();
    const filteredData = data.filter((post) => post.id === postId) || null;
    return filteredData[0];
  };

  const {
    data: postData,
    isLoading,
    error
  } = useQuery<CommunityPosts>({
    queryKey: ['post', postId],
    queryFn: getPost,
    enabled: !!postId
  });
  const userIdFromPost = postData?.user_id;

  const { userData } = useProfile(userIdFromPost);

  const handleGetBookmarkData = async (): Promise<BookmarkData | undefined> => {
    const { data, count } = await fetch(`/api/bookmark/${postId}`).then((res) => res.json());
    if (data.errorMsg) {
      return;
    }
    return { data, count };
  };

  const { data: bookmarkData } = useQuery<BookmarkData | undefined>({
    queryKey: ['bookmark', postId],
    queryFn: handleGetBookmarkData
  });

  const handlePostBookmark = async () => {
    const data = await fetch(`/api/bookmark/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId, userId, category })
    }).then((res) => res.json());

    return data;
  };

  const { mutate: addBookmark } = useMutation({
    mutationFn: handlePostBookmark,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['bookmark', postId] });
      const previousData = queryClient.getQueryData<BookmarkData>(['bookmark', postId]);
      queryClient.setQueryData(['bookmark', postId], (prev: { data: BookMark[]; count: number }) => {
        const newData = {
          posts_id: postId,
          user_id: userId
        };
        return { data: [...prev.data, newData], count: prev.count + 1 };
      });
      return { previousData };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['bookmark', postId], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark', postId] });
    }
  });

  const handleDeleteBookmark = async () => {
    const data = await fetch(`/api/bookmark/${postId}?userId=${userId}`, {
      method: 'DELETE'
    }).then((res) => res.json());

    return data;
  };

  const { mutate: deleteBookmark } = useMutation({
    mutationFn: handleDeleteBookmark,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['bookmark', postId] });
      const previousData = queryClient.getQueryData<BookmarkData>(['bookmark', postId]);
      queryClient.setQueryData(['bookmark', postId], (prev: { data: BookMark[]; count: number } | undefined) => {
        if (!prev) return { data: [], count: 0 };
        const updatedData = prev.data.filter((item) => item.user_id !== userId);
        return { data: updatedData, count: updatedData.length };
      });
      return { previousData };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['bookmark', postId], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark', postId] });
    }
  });

  const handleToggleBookmark = () => {
    if (!isLogin) {
      Notify.failure('로그인 후 이용해주세요.');
      const presentPage = window.location.href;
      const pagePathname = new URL(presentPage).pathname;
      Cookies.set('returnPage', pagePathname);
      router.push('/login');
    } else {
      if (bookmarkData?.data.find((item) => item.user_id === userId)) {
        deleteBookmark();
      } else {
        addBookmark();
      }
    }
  };

  const deletePost = async () => {
    const response = await fetch(`/api/communityRead/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const deleteMutation = useMutation<void, Error, string | string[]>({
    mutationFn: deletePost,
    onSuccess: () => {
      Notify.success('게시글이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      router.back();
    },
    onError: (error) => {
      Notify.failure('삭제에 실패했습니다.');
      console.error('삭제에 실패했습니다.', error);
    }
  });

  const handleDelete = () => {
    if (userId === userIdFromPost) {
      Confirm.show(
        '게시글 삭제',
        '정말로 삭제하시겠습니까?',
        '네',
        '아니오',
        () => {
          deleteMutation.mutate(postId!);
        },
        () => {
          Notify.failure('삭제가 취소되었습니다.');
        },
        {}
      );
    } else {
      Notify.failure('삭제 권한이 없습니다.');
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = () => {
    router.back();
  };

  return (
    <div className="flex flex-col relative">
      <div
        className="md:mb-5 mb-3 ml-2 cursor-pointer group md:w-[65px] md:h-[65px] w-[30px] h-[30px]"
        onClick={handleNavigation}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="63" height="63" rx="31.5" stroke="#9FA8B2" />
          <path
            d="M40 31.5C40.2761 31.5 40.5 31.7239 40.5 32C40.5 32.2761 40.2761 32.5 40 32.5V31.5ZM23.6464 32.3536C23.4512 32.1583 23.4512 31.8417 23.6464 31.6464L26.8284 28.4645C27.0237 28.2692 27.3403 28.2692 27.5355 28.4645C27.7308 28.6597 27.7308 28.9763 27.5355 29.1716L24.7071 32L27.5355 34.8284C27.7308 35.0237 27.7308 35.3403 27.5355 35.5355C27.3403 35.7308 27.0237 35.7308 26.8284 35.5355L23.6464 32.3536ZM40 32.5H24V31.5H40V32.5Z"
            fill="#24292D"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex  justify-between">
          <ul className="flex gap-[24px]">
            {postData?.lang_category?.map((lang, index) => {
              const categoryData = CodeCategories.find((cat) => cat.name === lang);
              return (
                <div key={index} className="flex gap-[9px]">
                  {categoryData && (
                    <Image src={categoryData.image} alt={lang} width={24} height={24} className="rounded-full" />
                  )}
                  <p className="text-gray-600">{lang}</p>
                </div>
              );
            })}
          </ul>
          <button className="w-5 h-5 flex justify-center" onClick={toggleMenu}>
            <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="1.9987" cy="2.33341" r="1.66667" fill="#828F9B" />
              <circle cx="1.9987" cy="8.99992" r="1.66667" fill="#828F9B" />
              <circle cx="1.9987" cy="15.6667" r="1.66667" fill="#828F9B" />
            </svg>
          </button>
          {isOpen && (
            <div
              className="absolute bg-white rounded-[16px] shadow-md w-[150px]"
              style={{
                top: '20%',
                right: '0',
                zIndex: 1000
              }}
            >
              <ul>
                <div className="flex px-4 py-2 hover:bg-gray-200 cursor-pointer gap-2">
                  <Image
                    src="/pencil_color.svg"
                    alt="수정"
                    width={24}
                    height={24}
                    className="filter brightness-0 invert-0"
                  />
                  수정하기
                </div>
                <hr className="w-full h-[1px] bg-gray-100 border-0" />
                <div className="flex px-4 py-2 hover:bg-gray-200 cursor-pointer gap-2" onClick={handleDelete}>
                  <Image
                    src="/trashCan_color.svg"
                    alt="삭제"
                    width={24}
                    height={24}
                    className="filter brightness-0 invert-0"
                  />
                  삭제하기
                </div>
              </ul>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold">{postData?.title}</h1>
        <div className="text-base flex gap-[24px]">
          {userIdFromPost === userData?.id && <p className="text-base">{userData?.nickname}</p>}
          <p>{postData?.created_at.split('T')[0]}</p>
          <div className="flex gap-[8px]">
            {/* 내가 이 게시물을 찜하기한 적이 있는가? */}
            {/* bookmarkData.data.find(() => userId랑 bookmark에 있는 userId랑 같은 게 있는지)  */}
            {bookmarkData?.data.find((item) => item.user_id === userId) ? (
              <Image
                src="/bookmark.svg"
                alt="글 찜한 후 북마크 아이콘"
                width={16}
                height={16}
                onClick={handleToggleBookmark}
              />
            ) : (
              <Image
                src="/bookmark_dark.svg"
                alt="글 찜하기 전 북마크 아이콘"
                width={16}
                height={16}
                onClick={handleToggleBookmark}
              />
            )}
            <p>{bookmarkData?.count}</p>
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-gray-100 my-8" />
      {postData?.post_img?.[0] && <Image src={postData.post_img[0]} alt="Post Image" width={800} height={500} />}
      <div data-color-mode="light">
        <MDEditor.Markdown source={postData?.content} />
      </div>
    </div>
  );
}
