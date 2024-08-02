'use client';

import { CommunityComments } from '@/types/type';
import favicon from '../../../../../../public/vercel.svg';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuCommentList() {
  const { id } = useParams();

  const getComments = async (): Promise<CommunityComments[]> => {
    const response = await fetch('/api/communityComments');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityComments[] = await response.json();

    const filteredData = data.filter((comment) => comment.community_post_id === id);
    console.log(filteredData);
    return filteredData;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['comment', id],
    queryFn: getComments,
    enabled: !!id
  });

  console.log(data);

  return (
    <div className="flex flex-col">
      <div className=" text-base flex flex-col gap-[24px] ">
        {data &&
          data.map((comment) => (
            <div key={comment.id}>
              <p className="font-bold">{comment.user_id}</p>
              <p>{comment.contents}</p>
              <div className="flex gap-[24px]">
                <p>{comment.created_at}</p>
                <div className="flex gap-1">
                  <button>삭제</button>
                  <button>수정</button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <hr className="w-full h-[1px] bg-black border-0 my-[32px]" />
    </div>
  );
}

// 페이지네이션 - 무한 스크롤 구현 필요
