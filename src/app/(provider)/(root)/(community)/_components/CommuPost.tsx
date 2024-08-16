'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookMark, CommunityPosts } from '@/types/type';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import useProfile from '@/hooks/useProfile';
import useAuthStore from '@/zustand/authStore';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

type BookmarkData = {
  data: BookMark[];
  count: number;
};

export default function CommuPost() {
  const { id: postId } = useParams();
  const { userId } = useAuthStore();
  console.log(postId);

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
  //  const [filteredData, setFilteredData] = useState<CommunityPosts | null>(null);
  //   const filtered: CommunityPosts | null = data.find((post) => post.id === id)|| null;
  //   setFilteredData(filtered);
  // } catch (error) {
  //   console.error('Fetch data error:', error);
  //   setFilteredData(null);
  // };
  // 추후 return문 안에서 filteredData 이용

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

  // 리팩토링 전
  // const getUserData = async (userId: string) => {
  //   const supabase = createClient();
  //   const { data } = await supabase.from('Users').select('*').eq('id', userId).maybeSingle();
  //   return data;
  // };
  // const { data: userData } = useQuery({
  //   queryKey: [userIdFromPost],
  //   queryFn: () => getUserData(userIdFromPost!),
  //   enabled: !!userIdFromPost
  // });

  // 리팩토링 후
  const { userData, isUserDataPending, userDataError } = useProfile(userIdFromPost);

  const handleGetBookmarkData = async (): Promise<BookmarkData | undefined> => {
    const { data, count } = await fetch(`/api/bookmark/${postId}`).then((res) => res.json());
    if (data.errorMsg) {
      console.log(data.errorMsg);
      return;
    }
    return { data, count };
  };

  const { data: bookmarkData } = useQuery<BookmarkData | undefined>({
    queryKey: ['bookmark', postId],
    queryFn: handleGetBookmarkData
  });

  console.log({ bookmarkData });

  const handlePostBookmark = async () => {
    const data = await fetch(`/api/bookmark/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId, userId })
    }).then((res) => res.json());

    return data;
  };

  const { mutate: addBookmark } = useMutation({
    mutationFn: handlePostBookmark,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['bookmark', postId] });
      const previousData = queryClient.getQueryData<BookmarkData>(['bookmark', postId]);
      queryClient.setQueryData(['bookmark', postId], (prev: { data: BookMark[]; count: number }) => {
        return { ...prev, count: prev.count + 1 };
      });
      return [previousData];
    },
    onError: (error, _, context) => {
      console.log(error.message);
      // queryClient.setQueryData(['bookmark', postId], context?.previousData);
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
        console.log(prev);
        if (!prev) return { data: [], count: 0 };
        const updatedData = prev.data.filter((item) => item.posts_id !== postId && item.user_id !== userId);
        return { data: updatedData, count: updatedData.length };
      });
      return { previousData };
    },
    onError: (error, _, context) => {
      console.log(error.message);
      queryClient.setQueryData(['bookmark', postId], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark', postId] });
    }
  });

  const handleToggleBookmark = () => {
    if (bookmarkData?.data.find((item) => item.user_id === userId)) {
      deleteBookmark();
    } else {
      addBookmark();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 py-6">
        <ul className="flex gap-[24px]">
          {postData?.lang_category?.map((lang, index) => (
            <li key={index} className={langSt}>
              {lang}
            </li>
          ))}
        </ul>
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
      <hr className="w-full border-t border-black my-8" />
      {postData?.post_img?.[0] && <Image src={postData.post_img[0]} alt="Post Image" width={800} height={500} />}

      <MDEditor.Markdown source={postData?.content} />
    </div>
  );
}
