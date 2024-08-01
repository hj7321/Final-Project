'use client';

import useAuthStore from '@/zustand/authStore';
import favicon from '../../../../../../public/vercel.svg';
import { CommunityComments } from '@/types/type';
import ReactQuill from 'react-quill';
import { FormEvent, useState } from 'react';
import { comment } from 'postcss';
import { useParams, useRouter } from 'next/navigation';

const langSt = 'text-[14px] flex items-center gap-[12px] ';
const iconSt = 'w-[24px] h-[24px]';

export default function CommuComment() {
  const [value, setValue] = useState<string>('');
  const { isLogin, userId } = useAuthStore();
  const router = useRouter();
  const { id } = useParams();

  console.log(id);

  const handleCheckLogin = () => {
    if (!isLogin) {
      alert('로그인 후 이용해 주세요');
      router.push('/login');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const commentData: string = formData.get('comment') as string;

    const response = await fetch('/api/communityComments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, commentData, userId })
    }).then((res) => res.json());
  };

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
      <form onSubmit={handleSubmit} className="flex gap-[32px] mt-[32px]">
        <textarea
          onClick={handleCheckLogin}
          className="w-[995px] h-[101px] rounded-[8px] border border-black text-[16px] px-2 py-1 resize-none"
          name="comment"
          placeholder="도움이 되는 댓글을 등록하세요!"
        />
        <>
          {/* <ReactQuill value={value} onChange={(e) => setValue(e.target.value)} />
          <input type="hidden" name="editorContent" value={value} />
          <button type="submit">Submit</button> */}
        </>
        <button className="w-[173px] h-[101px] rounded-lg bg-black text-white font-bold text-base flex items-center justify-center">
          댓글 등록
        </button>
      </form>
    </div>
  );
}

// 페이지네이션 - 무한 스크롤 구현 필요
