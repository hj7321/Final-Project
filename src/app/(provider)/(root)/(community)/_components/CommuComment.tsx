'use client';

import favicon from '../../../../../../public/vercel.svg';
import { CommunityComments } from '@/types/type';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuComment() {
  const fetchData = async (data) => {
    const response = await fetch('/api/communityComments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('error!');
    }
    return response.json();
  };

  // useMutation 써야 할듯

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!contentRef.current?.value.trim()) {
  //     Notify.failure("댓글 내용을 입력해주세요."); // 댓글 내용이 비어있는 경우 알림을 표시합니다.
  //     return;
  //   }
  //   if (profile !== undefined) {
  //     const commentsData: CommentsData = {
  //       nickname: profile?.data?.nickname as string, // 프로필에서 닉네임을 가져옵니다.
  //       user_id: user?.user_metadata.sub, // 사용자 ID를 가져옵니다.
  //       content: contentRef.current?.value || "", // 댓글 내용을 가져옵니다.
  //       post_id: params.id as string, // 게시물 ID를 가져옵니다.
  //     };
  //     addMutation(commentsData); // 댓글을 추가하는 mutation을 실행합니다.
  //   }
  // };

  return (
    <div className="flex flex-col">
      <div className="flex gap-[24px]">
        <div className={langSt}>
          <img src={favicon} className={iconSt} />
          <p>27</p>
        </div>
        <div className={langSt}>
          <img src={favicon} className={iconSt} />
          <p>3</p>
        </div>
      </div>
      <div className="flex gap-[32px] mt-[32px]">
        <textarea
          className="w-[995px] h-[101px] rounded-[8px] border border-black text-[16px] px-2 py-1 resize-none"
          placeholder="도움이 되는 댓글을 등록하세요!"
        />
        <button className="w-[173px] h-[101px] rounded-lg bg-black text-white font-bold text-base flex items-center justify-center">
          댓글 등록
        </button>
      </div>
    </div>
  );
}

// 페이지네이션 - 무한 스크롤 구현 필요
