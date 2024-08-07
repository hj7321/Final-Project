'use client';

import { createClient } from '@/utils/supabase/client';
import clsx from 'clsx';
import Image from 'next/image';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { validateForms } from '../../signup/_components/Validate';

const inputs = [
  { label: '비밀번호', type: 'password', id: 'pw' },
  { label: '비밀번호 확인', type: 'password', id: 'pwCheck' }
];

export default function ResetPasswordPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill(''));
  const [showPassword, setShowPassword] = useState<boolean[]>(Array(2).fill(false));
  const [changePassword, setChangePassword] = useState<string>('');

  const [inputMsgs, setInputMsgs] = useState<string[]>(Array(inputs.length).fill(''));

  const [throttling, setThrottling] = useState<boolean>(false);

  const supabase = createClient();

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

  const handleTogglePassword = (idx: number): void => {
    const newVisibility = [...showPassword];
    newVisibility[idx] = !newVisibility[idx];
    setShowPassword(newVisibility);
  };

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
      setThrottling(true);
      console.log('여기 들어오나');
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const password: string = formData.get('pw') as string;
      setChangePassword(password);
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        const { data, error } = await supabase.auth.updateUser({ password: changePassword });
        if (data) alert('비밀번호가 성공적으로 변경되었습니다.');
        if (error) alert('비밀번호 변경에 실패했습니다.');
      }
    });
  }, [changePassword, supabase.auth]);

  return (
    <section className="flex flex-col text-center items-center bg-grey-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!throttling) handleChangePW(e);
        }}
        className="flex flex-col justify-center items-center w-[528px] min-h-[560px] bg-white py-[64px] rounded-[24px] gap-[32px]"
      >
        <Image src="/logo_eng.svg" alt="영어 로고" width={180} height={60} />
        <h2 className="H2-L">비밀번호 재설정</h2>
        <p className={clsx('Body-M', 'text-grey-600')}>코듀(CodeU)에서 사용할 비밀번호를 입력해주세요.</p>
        <div className="flex flex-col gap-[10px]">
          {inputs.map((input, idx) => (
            <div key={input.id} className="flex flex-col items-center relative">
              <div
                className={clsx(
                  'w-[400px] border rounded-[8px] px-[16px]',
                  idx === selectedIdx
                    ? 'h-[70px] border-primary-500 pt-[6px]'
                    : inputValues[idx].length === 0
                    ? 'h-[56px] border-grey-100 py-[16px]'
                    : inputMsgs[idx].length === 0
                    ? 'h-[70px] border-grey-500 pt-[6px]'
                    : 'h-[70px] border-error pt-[6px]'
                )}
              >
                <label
                  className={clsx(
                    'self-start text-[12px]',
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
                      'placeholder-grey-300'
                    )}
                    type={showPassword[idx] ? 'text' : input.type}
                    id={input.id}
                    name={input.id}
                    placeholder={input.label}
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
                      className={clsx('absolute right-[16px] cursor-pointer', showPassword[idx] ? 'hidden' : 'block')}
                    />
                    <Image
                      src="/eye_opened_grey.svg"
                      alt="비밀번호 보기"
                      width={24}
                      height={24}
                      className={clsx('absolute right-[16px] cursor-pointer', showPassword[idx] ? 'block' : 'hidden')}
                    />
                  </button>
                </div>
              </div>
              <p
                className={
                  inputMsgs[idx].length > 0 ? 'block self-start text-[13.5px] my-[3px] ml-[3px] text-error' : 'hidden'
                }
              >
                {inputMsgs[idx]}
              </p>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="h-[56px] w-[400px] rounded-[8px] bg-primary-500 hover:bg-primary-700 text-white"
        >
          변경 완료
        </button>
      </form>
    </section>
  );
}
