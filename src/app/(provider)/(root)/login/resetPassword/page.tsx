'use client';

import useResetPassword from '@/hooks/useResetPassword';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const {
    inputs,
    inputRefs,
    selectedIdx,
    setSelectedIdx,
    inputValues,
    showPassword,
    inputMsgs,
    throttling,
    handleInputChange,
    handleTogglePassword,
    handleChangePW
  } = useResetPassword();

  return (
    <section className="flex flex-col text-center items-center justify-center md:bg-grey-50">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // 폼 제출 방지
          // 버튼 클릭을 허용한 경우(throttling 변수가 false일 경우)에만 handleChangePW 이벤트 핸들러 호출
          if (!throttling) handleChangePW(e);
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
                      'placeholder-grey-300 text-[14px] md:text-[16px] w-[310px]'
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
