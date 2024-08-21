import { CodeCategories } from '@/components/dumy';
import Image from 'next/image';
import React from 'react';
import bookmark_dark from '../../../../../../../../public/bookmark_dark.svg';
import { BookMark } from '@/types/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Notify } from 'notiflix';
import Cookies from 'js-cookie';
import useAuthStore from '@/zustand/authStore';
import { useParams, useRouter } from 'next/navigation';

interface ServiceMobileViewProps {
  title: string;
  langCategory: string[];
  price: number;
}

type BookmarkData = {
  data: BookMark[];
  count: number;
};

export default function ServiceMobileView({ title, langCategory, price }: ServiceMobileViewProps) {
  const { id: postId } = useParams();
  const { userId, isLogin } = useAuthStore();
  const router = useRouter();

  const queryClient = useQueryClient();

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
      body: JSON.stringify({ postId, userId, category: 'pro' })
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

  return (
    <div className="md:hidden flex flex-col mt-[5px] md:mt-0">
      <p className="text-base md:text-2xl">{title}</p>
      <p className="text-xs mt-1 flex flex-row flex-wrap">
        {langCategory.map((lang) => {
          const category = CodeCategories.find((cat) => cat.name === lang);
          return category ? (
            <React.Fragment key={category.id}>
              <Image src={category.image} width={15} height={15} alt={lang} className="mr-1 mt-2" />
              <span className="mr-3 mt-2">{lang}</span>
            </React.Fragment>
          ) : null;
        })}
      </p>
      <div className="flex-row flex items-center">
        <p className="text-base md:text-xl mt-2">{price}원</p>
          <div className="flex gap-[4px] mt-2 ml-[16px]">
            {bookmarkData?.data.find((item) => item.user_id === userId) ? (
              <Image
                src="/bookmark.svg"
                alt="글 찜한 후 북마크 아이콘"
                width={12}
                height={12}
                onClick={handleToggleBookmark}
              />
            ) : (
              <Image
                src="/bookmark_dark.svg"
                alt="글 찜하기 전 북마크 아이콘"
                width={12}
                height={12}
                onClick={handleToggleBookmark}
              />
            )}
            <p>{bookmarkData?.count}</p>
          </div>
      </div>
    </div>
  );
}
