'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { CommunityPosts } from '@/types/type';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import useProfile from '@/hooks/useProfile';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuPost() {
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
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

  const {
    data: postData,
    isLoading,
    error
  } = useQuery<CommunityPosts>({
    queryKey: ['post', id],
    queryFn: getPost,
    enabled: !!id
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

  const getBookmarkData = async () => {
    const { data, count } = await fetch(`/api/bookmark/${id}`).then((res) => res.json());
    if (data.errorMsg) {
      console.log(data.errorMsg);
      return;
    }
    return {
      data,
      count
    };
  };

  const { data: bookmarkData } = useQuery({
    queryKey: ['bookmarkCount', id],
    queryFn: () => getBookmarkData()
  });

  const mutation = useMutation({
    mutationFn: () => {
      // 실제 bookmark를 삭제하거나, 추가하거나
    },
    onMutate: () => {
      // 1. 기존 useQuery에서 데이터를 가져오는 걸 일단 멈춘다.
      // await queryClient.cancelQueries({ queryKey:  ['bookmarkCount', id] })
      // 2. 이전에 가지고 있던 값을 잠시 가져온다.
      // Snapshot the previous value
      // const previousTodos = queryClient.getQueryData(['bookmarkCount', id])
      // 3.state 변경하듯이 값을 갈아끼운다.
      // Optimistically update to the new value
      // queryClient.setQueryData(['todos'], (old) => [...old, newTodo])
      //4.  Return a context object with the snapshotted value
      // return { previousTodos }
    }
  });

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
            {isClicked ? (
              <Image
                src="/bookmark.svg"
                alt="글 찜한 후 북마크 아이콘"
                width={16}
                height={16}
                // db에 넣는 걸 추가할 예정
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
            <p>{bookmarkData?.count}</p>
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-black my-8" />
      {postData?.post_img?.[0] && <Image src={postData.post_img[0]} alt="Post Image" width={800} height={500} />}

      <MDEditor.Markdown source={postData?.content} />
      {/* <p className="py-6">{data?.content}</p> */}
    </div>
  );
}
