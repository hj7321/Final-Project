'use client';

import useResetPassword from '@/hooks/useResetPassword';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ResetPasswordInMobile() {
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

  const router = useRouter();

  const goToPrevPage = () => {
    router.back();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // 폼 제출 방지
        // 버튼 클릭을 허용한 경우(throttling 변수가 false일 경우)에만 handleChangePW 이벤트 핸들러 호출
        if (!throttling) handleChangePW(e);
      }}
      className="flex flex-col md:hidden fixed bg-white z-50 inset-0"
    >
      <div className="flex justify-center items-center h-[56px] p-[16px] border-b border-grey-100">
        <button type="button" onClick={goToPrevPage} className="left-0 absolute">
          <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
        </button>
        <h2 className={clsx('H3-L', 'text-grey-900')}>비밀번호 변경</h2>
      </div>
      <div className="p-[16px] flex flex-col items-center">
        <div className="flex flex-col gap-[10px] mb-[40px]">
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
            throttling && 'hover:cursor-default bg-black text-white bg-opacity-40 text-opacity-50',
            'Body-M',
            'w-[328px] bg-primary-500 rounded-[8px] hover:bg-primary-700 text-white p-[16px]'
          )}
        >
          비밀번호 변경
        </button>
      </div>
    </form>
  );
}
