'use client';

import { createClient } from '@/utils/supabase/client';
import clsx from 'clsx';
import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';
import { validateForms } from '../../signup/_components/Validate';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const inputs = [
  { label: '비밀번호', type: 'password', id: 'pw' },
  { label: '비밀번호 확인', type: 'password', id: 'pwCheck' }
];

export default function ResetPasswordPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // 각 인풋 요소를 가리키는 참조 변수 배열
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null); // 선택된 인풋 필드의 인덱스
  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill('')); // 각 인풋 필드의 값(내용)이 담긴 배열
  const [showPassword, setShowPassword] = useState<boolean[]>(Array(2).fill(false)); // 비밀번호를 표시할지 여부를 결정하는 boolean 값이 담긴 배열 (비밀번호, 비밀번호 확인)
  const [inputMsgs, setInputMsgs] = useState<string[]>(Array(inputs.length).fill('')); // 각 인풋 필드의 유효성 메시지가 담긴 배열

  const [throttling, setThrottling] = useState<boolean>(false); // 버튼 연속 클릭 방지

  const router = useRouter();

  const supabase = createClient();

  // 인풋 필드의 값이 바뀔(입력될) 때마다 호출되는 이벤트 핸들러 -> 값에 맞는 유효성 메시지가 실시간으로 바뀜
  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValues(newValues);

    const alertMessage = validateForms(newValues[idx], idx + 1);
    const newMsgs = [...inputMsgs];
    if (idx === 1 && inputValues[0] !== newValues[1]) {
      newMsgs[idx] = '비밀번호가 일치하지 않습니다.';
    } else {
      newMsgs[idx] = alertMessage;
    }
    setInputMsgs(newMsgs);
  };

  // 비밀번호를 보여줄지, 숨길지 여부를 결정하는 이벤트 핸들러
  const handleTogglePassword = (idx: number): void => {
    const newVisibility = [...showPassword];
    newVisibility[idx] = !newVisibility[idx];
    setShowPassword(newVisibility);
  };

  // 비밀번호 변경을 진행하는 이벤트 핸들러
  const handleChangePW = async (e: FormEvent<HTMLFormElement>) => {
    if (inputMsgs[0] !== '') {
      inputRefs.current[0]!.focus();
      return;
    } else if (inputMsgs[1] !== '') {
      inputRefs.current[1]!.focus();
      return;
    } else if (inputValues[0] === '' || inputValues[1] === '') {
      return alert('비밀번호를 입력해주세요.');
    } else {
      setThrottling(true); // 모든 조건을 통과했으므로, 이 시점에서 버튼 클릭을 막음 (연속 제출 방지)

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const password: string = formData.get('pw') as string;

      // 비밀번호를 재설정하는 라우트 핸들러 호출
      const data = await fetch('/api/resetPassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      }).then((res) => res.json());

      if (data.errorMsg) {
        console.log(data.errorMsg);
        alert('비밀번호 변경에 실패했습니다.');
        setThrottling(false); // 다시 버튼 클릭을 허용함
        return;
      }

      // 비밀번호 재설정 성공 후 로직
      alert('비밀번호가 성공적으로 변경되었습니다.'); // (1) 성공 알럿 메시지 띄우기
      router.push('/'); // (2) 홈페이지로 이동
    }
  };

  return (
    <section className="flex flex-col text-center items-center justify-center md:bg-grey-50 md:min-h-[760px]">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // 폼 제출 방지
          // 버튼 클릭을 허용한 경우(throttling 변수가 false일 경우)에만 handleChangePW 이벤트 핸들러 호출
          if (!throttling) handleChangePW(e);
        }}
        className="flex flex-col justify-center items-center w-[528px] min-h-[560px] bg-white py-[64px] rounded-[24px] gap-[32px]"
      >
        <Image src="/logo_eng.svg" alt="영어 로고" width={180} height={60} className="hidden md:flex mb-[32px]" />
        <div className="relative flex justify-center items-center text-center md:hidden w-[328px] h-[48px]">
          <Link href="/" className="left-0 absolute">
            <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
          </Link>
          <Image src="/logo_eng.svg" alt="영어 로고" width={144} height={48} />
        </div>
        <h2 className="text-[20px] font-bold md:text-[24px]">비밀번호 재설정</h2>
        <p className="text-[14px] md:text-[16px] text-grey-600">코듀(CodeU)에서 사용할 비밀번호를 입력해주세요.</p>
        <div className="flex flex-col gap-[10px]">
          {inputs.map((input, idx) => (
            <div key={input.id} className="flex flex-col items-center relative">
              <div
                className={clsx(
                  'w-[328px] md:w-[400px] border rounded-[8px] px-[16px]',
                  idx === selectedIdx
                    ? 'h-[56px] md:h-[66px] border-primary-500 pt-[6px]'
                    : inputValues[idx].length === 0
                    ? 'h-[56px] md:h-[66px] border-grey-100 py-[16px] md:py-[20px]'
                    : inputMsgs[idx].length === 0
                    ? 'h-[56px] md:h-[66px] border-grey-500 pt-[6px]'
                    : 'h-[56px] md:h-[66px] border-error pt-[6px]'
                )}
              >
                <label
                  className={clsx(
                    'self-start text-[10px] md:text-[12px]',
                    idx === selectedIdx
                      ? 'flex text-primary-500'
                      : inputValues[idx].length > 0
                      ? 'flex text-grey-300'
                      : 'hidden'
                  )}
                  htmlFor={input.id}
                >
                  {input.label}
                </label>
                <div className="flex">
                  <input
                    className={clsx(
                      (idx === selectedIdx || inputValues[idx]!.length > 0) &&
                        'w-[312px] outline-none border-none p-0 mt-[5px]',
                      'placeholder-grey-300 text-[14px] md:text-[16px]'
                    )}
                    type={showPassword[idx] ? 'text' : input.type}
                    id={input.id}
                    name={input.id}
                    placeholder={idx === selectedIdx ? '' : input.label}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    onFocus={() => setSelectedIdx(idx)}
                    onBlur={() => setSelectedIdx(null)}
                    value={inputValues[idx] || ''}
                    onChange={(e) => handleInputChange(idx, e)}
                  />

                  <button type="button" className="flex items-center" onClick={() => handleTogglePassword(idx)}>
                    <Image
                      src="/eye_closed_grey.svg"
                      alt="비밀번호 숨기기"
                      width={24}
                      height={24}
                      className={clsx(
                        'absolute right-[16px] cursor-pointer w-[20px] h-[20px] md:w-[24px] md:h-[24px]',
                        showPassword[idx] ? 'hidden' : 'block'
                      )}
                    />
                    <Image
                      src="/eye_opened_grey.svg"
                      alt="비밀번호 보기"
                      width={24}
                      height={24}
                      className={clsx(
                        'absolute right-[16px] cursor-pointer w-[20px] h-[20px] md:w-[24px] md:h-[24px]',
                        showPassword[idx] ? 'block' : 'hidden'
                      )}
                    />
                  </button>
                </div>
              </div>
              <p
                className={
                  inputMsgs[idx].length > 0
                    ? 'block self-start text-[11px] md:text-[13.5px] my-[3px] ml-[3px] text-error'
                    : 'hidden'
                }
              >
                {inputMsgs[idx]}
              </p>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className={clsx(
            'h-[56px] w-[328px] md:w-[400px] rounded-[8px]',
            throttling
              ? 'hover:cursor-default bg-primary-300 text-white bg-opacity-50 text-opacity-50'
              : ' bg-primary-500 hover:bg-primary-700 text-white'
          )}
        >
          변경 완료
        </button>
      </form>
    </section>
  );
}
