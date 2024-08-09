'use client';

import { createClient } from '@/utils/supabase/client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function SendLinkPage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [throttling, setThrottling] = useState<boolean>(false);

  const supabase = createClient();

  const handleSendLink = async (e: FormEvent<HTMLFormElement>) => {
    setThrottling(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email: string = formData.get('email') as string;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/login/resetPassword'
    });

    if (error) console.error('비밀번호 찾기 에러: ', error);
    if (data) {
      console.log(data);
      alert('입력하신 이메일로 비밀번호 재설정 링크를 보내드렸습니다. 이메일을 확인해주세요.');
    }
  };

  return (
    <section className="flex flex-col text-center items-center justify-center md:bg-grey-50 md:min-h-[678px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!throttling) handleSendLink(e);
        }}
        className="flex flex-col justify-center items-center w-[528px] min-h-[578px] bg-white py-[64px] rounded-[24px] gap-[32px]"
      >
        <Image src="/logo_eng.svg" alt="영어 로고" width={180} height={60} className="hidden md:flex mb-[32px]" />
        <div className="relative flex justify-center items-center text-center md:hidden w-[328px] h-[48px]">
          <Link href="/" className="left-0 absolute">
            <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
          </Link>
          <Image src="/logo_eng.svg" alt="영어 로고" width={144} height={48} />
        </div>
        <h2 className="text-[20px] font-bold md:text-[24px]">비밀번호 찾기</h2>
        <div className="text-[14px] md:text-[16px] text-grey-600">
          <p>가입 시 등록했던 이메일로</p>
          <p>비밀번호를 변경할 수 있는 링크를 보내드려요.</p>
        </div>
        <div
          className={clsx(
            'w-[328px] md:w-[400px] border rounded-[8px] px-[16px]',
            isSelected
              ? 'h-[56px] md:h-[70px] border-primary-500 pt-[6px]'
              : inputValue.length === 0
              ? 'h-[56px] border-grey-100 py-[16px]'
              : 'h-[56px] md:h-[70px] border-grey-500 pt-[6px]'
          )}
        >
          <label
            className={clsx(
              'self-start text-[10px] md:text-[12px]',
              isSelected ? 'flex text-primary-500' : inputValue.length > 0 ? 'flex text-grey-300' : 'hidden'
            )}
            htmlFor="email"
          >
            이메일
          </label>
          <div className="flex">
            <input
              className={clsx(
                (isSelected || inputValue!.length > 0) && 'w-[312px] outline-none border-none p-0 mt-[5px]',
                'placeholder-grey-300 text-[14px] md:text-[16px]'
              )}
              type="text"
              id="email"
              name="email"
              placeholder={isSelected ? '' : '이메일'}
              onFocus={() => setIsSelected(true)}
              onBlur={() => setIsSelected(false)}
              value={inputValue || ''}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className={clsx(
            throttling && 'hover:cursor-default bg-black text-white bg-opacity-40 text-opacity-50',
            'h-[56px] w-[328px] md:w-[400px] rounded-[8px] bg-primary-500 hover:bg-primary-700 text-white'
          )}
        >
          전송하기
        </button>
        <div className="flex justify-center gap-[24px] text-[12px] md:text-[14px]">
          <p>비밀번호가 생각나셨나요?</p>
          <Link href="/login" className="font-bold">
            로그인 하기 {'>'}
          </Link>
        </div>
      </form>
    </section>
  );
}
