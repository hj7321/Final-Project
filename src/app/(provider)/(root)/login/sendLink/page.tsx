'use client';

import useFetchData from '@/hooks/useFetchData';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Notify } from 'notiflix';
import { FormEvent, useRef, useState } from 'react';

export default function SendLinkPage() {
  const inputRef = useRef<HTMLInputElement | null>(null); // 이메일 인풋 요소를 가리키는 참조 변수
  const [isSelected, setIsSelected] = useState<boolean>(false); // 이메일 인풋 필드가 선택됐는지 여부를 설정하는 boolean 값
  const [inputValue, setInputValue] = useState<string>(''); // 이메일 인풋 필드의 값(내용)
  const [inputMsg, setInputMsg] = useState<string>(''); // 이메일 인풋 필드의 유효성 메시지

  const { emailData } = useFetchData(); // Users 테이블의 모든 이메일이 담긴 배열

  const [throttling, setThrottling] = useState<boolean>(false); // 버튼 연속 클릭 방지

  const router = useRouter();

  // 인풋 필드의 값이 바뀔(입력될) 때마다 호출되는 이벤트 핸들러 -> 값에 맞는 유효성 메시지가 실시간으로 바뀜
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!emailData!.includes(newValue)) {
      setInputMsg('존재하지 않는 이메일입니다.');
    } else if (emailData!.includes(newValue)) {
      setInputMsg('');
    }
  };

  // 받은 이메일로 비밀번호 재설정 링크를 보내는 이벤트 핸들러
  const handleSendLink = async (e: FormEvent<HTMLFormElement>) => {
    const isInputValueNull: boolean = inputValue === '';

    if (inputMsg !== '') {
      inputRef.current!.focus();
      return;
    } else if (isInputValueNull) {
      setInputMsg('이메일을 입력해주세요.');
      inputRef.current!.focus();
      return;
    } else {
      setThrottling(true); // 모든 조건을 통과했으므로, 이 시점에서 버튼 클릭을 막음 (연속 제출 방지)

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const email: string = formData.get('email') as string;

      // 비밀번호 재설정 페이지 링크 전송하는 라우트 핸들러 호출
      const data = await fetch('/api/sendLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      }).then((res) => res.json());

      if (data.errorMsg) {
        console.log(data.errorMsg);
        Notify.failure('링크 전송에 실패했습니다.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   잠시 후에 다시 시도해주세요.', {
          width: '250px'
        });
        setThrottling(false); // 다시 버튼 클릭을 허용함
        return;
      }

      // 비밀번호 재설정 페이지 링크 전송 성공 후 로직
      router.replace('/login/confirmEmail'); // 현재 페이지를 이메일 링크 전송 알림 페이지로 대체
    }
  };

  return (
    <section className="flex flex-col text-center items-center justify-center md:bg-grey-50">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // 폼 제출 방지
          // 버튼 클릭을 허용한 경우(throttling 변수가 false일 경우)에만 handleSendLink 이벤트 핸들러 호출
          if (!throttling) handleSendLink(e);
        }}
        className="w-[528px] flex flex-col items-center p-[64px] bg-white gap-[32px]"
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
        <div className="flex flex-col items-center">
          <div
            className={clsx(
              'w-[328px] md:w-[400px] border rounded-[8px] px-[16px]',
              isSelected
                ? 'h-[56px] md:h-[66px] border-primary-500 pt-[6px]'
                : inputValue.length === 0
                ? 'h-[56px] md:h-[66px] border-grey-100 py-[16px] md:py-[20px]'
                : inputMsg.length === 0
                ? 'h-[56px] md:h-[66px] border-grey-500 pt-[6px]'
                : 'h-[56px] md:h-[66px] border-error pt-[6px]'
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
                ref={(el) => {
                  inputRef.current = el;
                }}
                onFocus={() => setIsSelected(true)}
                onBlur={() => setIsSelected(false)}
                value={inputValue || ''}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
          <p
            className={
              inputMsg.length > 0
                ? 'block self-start text-[11px] md:text-[13.5px] mt-[3px] ml-[3px] text-error'
                : 'hidden'
            }
          >
            {inputMsg}
          </p>
        </div>

        <button
          type="submit"
          className={clsx(
            'h-[56px] w-[328px] md:w-[400px] rounded-[8px]',
            throttling
              ? 'hover:cursor-default bg-primary-300 text-white bg-opacity-50 text-opacity-50'
              : 'bg-primary-500 hover:bg-primary-700 text-white'
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
