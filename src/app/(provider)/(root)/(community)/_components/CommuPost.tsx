'use client';

import { useQuery } from '@tanstack/react-query';
import favicon from '../../../../../../public/vercel.svg';
import { CommunityPosts } from '@/types/type';
import { useParams } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useState } from 'react';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuPost() {
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const { userId } = useAuthStore();
  const { id } = useParams();

  const getPost = async (): Promise<CommunityPosts> => {
    const response = await fetch('/api/communityRead');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityPosts[] = await response.json();
    const filteredData = data.filter((post) => post.id === id) || null;
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

  const { data, isLoading, error } = useQuery<CommunityPosts>({
    queryKey: ['post', id],
    queryFn: getPost,
    enabled: !!id
  });

  const getUserData = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('Users').select('*').eq('id', userId).maybeSingle();
    return data;
  };

  const userIdFromPost = data?.user_id;

  const { data: userData } = useQuery({
    queryKey: [userIdFromPost],
    queryFn: () => getUserData(userIdFromPost!),
    enabled: !!userIdFromPost
  });

  const postId = data?.id;

  const getBookmarkData = async (): Promise<void> => {
    const data = await fetch('/api/bookmark', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId })
    }).then((res) => res.json());

    if (data.errorMsg) {
      console.log(data.errorMsg);
      return;
    }
    console.log(data.data);
    return data.data;
  };

  const { data: bookmarkData } = useQuery({
    queryKey: ['bookmarkCount'],
    queryFn: () => getBookmarkData()
  });

  console.log(bookmarkData);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 py-6">
        <ul className="flex gap-[24px]">
          {data?.lang_category?.map((lang, index) => (
            <li key={index} className={langSt}>
              {lang}
            </li>
          ))}
        </ul>
        <h1 className="text-2xl font-bold">{data?.title}</h1>
        <div className="text-base flex gap-[24px]">
          {userIdFromPost === userData?.id && <p className="text-base">{userData?.nickname}</p>}
          <p>{data?.created_at.split('T')[0]}</p>
          <div className="flex gap-[8px]">
            {isClicked ? (
              <Image
                src="/bookmark.svg"
                alt="글 찜한 후 북마크 아이콘"
                width={16}
                height={16}
                onClick={() => setIsClicked((prev) => !prev)}
              />
            ) : (
              <Image
                src="/bookmark_dark.svg"
                alt="글 찜하기 전 북마크 아이콘"
                width={16}
                height={16}
                onClick={() => setIsClicked((prev) => !prev)}
              />
            )}
            {/* 찜 횟수 요청하려면 post의 id를 라우트 핸들러에 보내야 함 */}
            <p>{6}</p>
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-black my-8" />
      {data?.post_img?.[0] && <Image src={data.post_img[0]} alt="Post Image" width={800} height={500} />}
      <p className="py-6">{data?.content}</p>
    </div>
  );
}
