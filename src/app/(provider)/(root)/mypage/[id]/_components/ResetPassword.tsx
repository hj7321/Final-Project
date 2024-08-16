import useResetPassword from '@/hooks/useResetPassword';
import clsx from 'clsx';
import Image from 'next/image';

export default function ResetPassword() {
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
    <form
      onSubmit={(e) => {
        e.preventDefault(); // 폼 제출 방지
        // 버튼 클릭을 허용한 경우(throttling 변수가 false일 경우)에만 handleChangePW 이벤트 핸들러 호출
        if (!throttling) handleChangePW(e);
      }}
      className="w-[924px] h-[564px] pl-[32px] flex flex-col"
    >
      <h2 className={clsx('H2-L', 'mb-[32px]')}>비밀번호 변경</h2>
      <div className="flex flex-col gap-[16px] mb-[24px]">
        {inputs.map((input, idx) => (
          <div key={input.id} className={clsx('Body-M', 'flex flex-col items-center relative')}>
            <div
              className={clsx(
                'w-[892px] h-[66px] border rounded-[8px] px-[16px]',
                idx === selectedIdx
                  ? 'border-primary-500 pt-[6px]'
                  : inputValues[idx].length === 0
                  ? 'border-grey-100 py-[20px]'
                  : inputMsgs[idx].length === 0
                  ? 'border-grey-500 pt-[6px]'
                  : 'border-error pt-[6px]'
              )}
            >
              <label
                className={clsx(
                  'self-start text-[12px] leading-[18px]',
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
                      'w-[878px] outline-none border-none p-0 mt-[5px]',
                    'placeholder-grey-300 text-[16px]'
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
                      'absolute right-[16px] cursor-pointer w-[24px] h-[24px]',
                      showPassword[idx] ? 'hidden' : 'block'
                    )}
                  />
                  <Image
                    src="/eye_opened_grey.svg"
                    alt="비밀번호 보기"
                    width={24}
                    height={24}
                    className={clsx(
                      'absolute right-[16px] cursor-pointer w-[24px] h-[24px]',
                      showPassword[idx] ? 'block' : 'hidden'
                    )}
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
        className={clsx(
          throttling && 'hover:cursor-default bg-black text-white bg-opacity-40 text-opacity-50',
          'Body-M',
          'bg-primary-500 rounded-[8px] hover:bg-primary-700 text-white py-[8px] px-[16px] self-end'
        )}
      >
        변경하기
      </button>
    </form>
  );
}
