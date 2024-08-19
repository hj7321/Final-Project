'use client';

import clsx from 'clsx';
import { FormEvent, useRef, useState } from 'react';
import { validateForms } from './Validate';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';
import Modal from './Modal';
import Image from 'next/image';
import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';
import { Notify, Report } from 'notiflix';

const inputs = [
  { label: '이메일', type: 'text', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw', icon: true },
  { label: '비밀번호 확인', type: 'password', id: 'pwCheck', icon: true },
  { label: '닉네임', type: 'text', id: 'nickname' },
  { label: '이름', type: 'text', id: 'name' },
  { label: '생년월일 ex)19990101', type: 'text', id: 'birth' }
];

const checkBoxes = [
  { label: '만 14세 이상입니다. (필수)', id: 'age' },
  { label: `서비스 이용약관 동의 (필수)`, id: 'service', link: true },
  { label: '개인정보 수집 및 이용 동의 (필수)', id: 'personal', link: true },

  { label: '마케팅 수신 동의 (선택)', id: 'marketing', link: true }
];

export default function SignUpForm() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // 각 인풋 요소를 가리키는 참조 변수 배열
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null); // 선택된 인풋 필드의 인덱스
  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill('')); // 각 인풋 필드의 값(내용)이 담긴 배열
  const [showPassword, setShowPassword] = useState<boolean[]>(Array(2).fill(false)); // 비밀번호를 표시할지 여부를 결정하는 boolean 값이 담긴 배열 (비밀번호, 비밀번호 확인)
  const [inputMsgs, setInputMsgs] = useState<string[]>(Array(inputs.length).fill('')); // 각 인풋 필드의 유효성 메시지가 담긴 배열

  const [showModal, setShowModal] = useState<number | null>(null); // 보여줄 모달의 종류를 숫자로 나타냄

  const [isChecked, setIsChecked] = useState<boolean>(false); // 체크박스에서 "전체 동의"가 체크되었는지 확인하는 boolean 값
  const [areChecked, setAreChecked] = useState<boolean[]>(Array(checkBoxes.length).fill(false)); // 체크박스에서 "전체 동의"를 제외한 각 항목이 체크되었는지 확인하는 boolean 값이 담긴 배열

  const { emailData, nicknameData } = useFetchData(); // 각각 Users 테이블의 모든 이메일, 닉네임이 담긴 배열

  const [throttling, setThrottling] = useState<boolean>(false); // 버튼 연속 클릭 방지

  const router = useRouter();

  const { login, setUserId } = useAuthStore(); // 각각 로그인 함수, 유저 고유 아이디 설정 함수

  // 인풋 필드의 값이 바뀔(입력될) 때마다 호출되는 이벤트 핸들러 -> 값에 맞는 유효성 메시지가 실시간으로 바뀜
  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValues(newValues);

    const alertMessage = validateForms(newValues[idx], idx);
    const newMsgs = [...inputMsgs];
    if (idx === 0 && emailData!.includes(newValues[0])) {
      newMsgs[idx] = '이미 존재하는 이메일입니다.';
    } else if (idx === 2 && inputValues[1] !== newValues[2]) {
      newMsgs[idx] = '비밀번호가 일치하지 않습니다.';
    } else if (idx === 3 && nicknameData!.includes(newValues[3])) {
      newMsgs[idx] = '이미 사용 중인 닉네임입니다.';
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

  // "전체 동의"란의 체크 여부를 확인하는 이벤트 핸들러
  // 체크가 되었으면, 나머지 4개의 체크박스에도 자동 체크 처리
  // 체크가 해제되었으면, 나머지 4개의 체크박스에도 자동 체크 해제
  const handleAllCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const checkedOrNot: boolean = e.target.checked;
    setIsChecked(checkedOrNot);
    if (checkedOrNot) setAreChecked(areChecked.fill(true));
    else setAreChecked(areChecked.fill(false));
  };

  // "전체 동의"를 제외한 4개 항목의 체크 여부를 확인하는 이벤트 핸들러
  // 4개 모두 체크가 되었으면, "전체 동의" 체크박스에도 자동 체크 처리
  // 4개 중 하나라도 체크가 해제되었으면, "전체 동의" 체크박스에도 자동 체크 해제
  const handleFourCheckBoxesChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValues: boolean[] = [...areChecked];
    newValues[idx] = e.target.checked;
    setAreChecked(newValues);
    const allCheckedOrNot: boolean[] = newValues.filter((value) => !value);
    if (allCheckedOrNot.length === 0) setIsChecked(true);
    else setIsChecked(false);
  };

  // 모달을 여는 이벤트 핸들러
  const handleOpenModal = (idx: number): void => {
    setShowModal(idx);
  };

  // 모달을 닫는 이벤트 핸들러
  const handleCloseModal = (): void => {
    setShowModal(null);
  };

  // 회원가입을 진행하는(사용자 정보를 제출하는) 이벤트 핸들러
  const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    const areInputValuesNull: string[] = inputValues.filter((value) => value === '');

    if (inputMsgs[0] !== '') {
      inputRefs.current[0]!.focus();
      return;
    } else if (inputMsgs[1] !== '') {
      inputRefs.current[1]!.focus();
      return;
    } else if (inputMsgs[2] !== '') {
      inputRefs.current[2]!.focus();
      return;
    } else if (inputMsgs[3] !== '') {
      inputRefs.current[3]!.focus();
    } else if (inputMsgs[4] !== '') {
      inputRefs.current[4]!.focus();
      return;
    } else if (inputMsgs[5] !== '') {
      inputRefs.current[5]!.focus();
      return;
    } else if (areInputValuesNull.length !== 0) {
      return Report.failure('회원가입 실패', '회원 정보를 모두 기입해주세요.', '확인');
    } else if (!areChecked[0] || !areChecked[1] || !areChecked[2]) {
      return Report.failure('회원가입 실패', '모든 필수 사항에 체크해주세요.', '확인');
    } else {
      setThrottling(true); // 모든 조건을 통과했으므로, 이 시점에서 버튼 클릭을 막음 (연속 제출 방지)

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const email: string = formData.get('email') as string;
      const password: string = formData.get('pw') as string;
      const nickname: string = formData.get('nickname') as string;
      const name: string = formData.get('name') as string;
      const birth: string = formData.get('birth') as string;

      // 회원가입 라우트 핸들러에 보낼 유저 정보를 하나의 객체로 만듦
      const dataForSubmit = { email, password, nickname, name, birth };

      // 회원가입 라우트 핸들러 호출
      const data = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForSubmit)
      }).then((res) => res.json());

      if (data.errorMsg) {
        Notify.failure(data.errorMsg);
        setThrottling(false); // 다시 버튼 클릭을 허용함
        return;
      }

      // 회원가입 성공 후 로직
      form.reset(); // (1) 폼 내용 모두 리셋
      login(); // (2) 로그인된 상태로 설정
      setUserId(data.userData.user.id); // (3) 유저 고유 아이디 설정
      router.replace('signup/signUpComplete'); // (4) 현재 페이지를 사용자 유형 선택 페이지로 대체
    }
  };

  return (
    <section className="flex flex-col text-center items-center justify-center md:bg-grey-50">
      {showModal !== null && <Modal onClose={handleCloseModal} modalNum={showModal} />}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // 폼 제출 방지
          // 버튼 클릭을 허용한 경우(throttling 변수가 false일 경우)에만 handleSignUp 이벤트 핸들러 호출
          if (!throttling) handleSignUp(e);
        }}
        className="w-[528px] flex flex-col items-center p-[64px] bg-white"
      >
        <h2 className={clsx('H2-L', 'hidden md:block mb-[32px]')}>회원가입</h2>
        <div className="relative flex justify-center items-center text-center md:hidden w-[328px] h-[48px] mb-[32px]">
          <Link href="/" className="left-0 absolute">
            <Image src="/backIcon.svg" alt="뒤로가기" width={21} height={21} />
          </Link>
          <h2 className={clsx('H3-L')}>회원가입</h2>
        </div>
        <div className="flex flex-col gap-[10px]">
          {inputs.map((input, idx) => (
            <div key={input.id} className={clsx(idx % 3 === 2 && 'mb-[32px]', 'flex flex-col items-center relative')}>
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
                        'w-[312px] outline-none border-none p-0 mt-[3px] md:mt-[5px]',
                      'placeholder-grey-300 text-[14px] md:text-[16px] w-[310px]'
                    )}
                    type={showPassword[idx - 1] ? 'text' : input.type}
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

                  {input.icon && (
                    <button type="button" className="flex items-center" onClick={() => handleTogglePassword(idx - 1)}>
                      <Image
                        src="/eye_closed_grey.svg"
                        alt="비밀번호 숨기기"
                        width={24}
                        height={24}
                        className={clsx(
                          'absolute right-[16px] cursor-pointer w-[20px] h-[20px] md:w-[24px] md:h-[24px]',
                          showPassword[idx - 1] ? 'hidden' : 'block'
                        )}
                      />
                      <Image
                        src="/eye_opened_grey.svg"
                        alt="비밀번호 보기"
                        width={24}
                        height={24}
                        className={clsx(
                          'absolute right-[16px] cursor-pointer w-[20px] h-[20px] md:w-[24px] md:h-[24px]',
                          showPassword[idx - 1] ? 'block' : 'hidden'
                        )}
                      />
                    </button>
                  )}
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

        <div className="h-[200px] md:h-[240px] w-[328px] md:w-[400px] mb-[32px] bg-grey-50 rounded-[8px] px-[16px] py-[20px] md:py-[24px] flex flex-col gap-[16px] md:gap-[24px] text-left">
          <div className="font-bold flex gap-[8px] text-[14px] md:text-[16px] items-center">
            <input
              className="custom-checkbox"
              type="checkbox"
              id="all-agree"
              checked={isChecked}
              onChange={(e) => handleAllCheckBoxChange(e)}
            />
            <label htmlFor="all-agree">전체 동의</label>
          </div>
          <div className="flex flex-col gap-[16px] text-[12px] md:text-[16px] text-grey-400">
            {checkBoxes.map((checkBox, idx) => (
              <div key={idx} className="flex justify-between gap-[8px] items-center">
                <div className="flex gap-[8px] items-center">
                  <input
                    className="custom-checkbox"
                    type="checkbox"
                    id={checkBox.id}
                    checked={areChecked[idx]}
                    onChange={(e) => handleFourCheckBoxesChange(idx, e)}
                  />
                  <label htmlFor={checkBox.id}>{checkBox.label}</label>
                </div>
                <button
                  type="button"
                  className="text-[10px] md:text-[12px] underline content-center"
                  onClick={() => handleOpenModal(idx - 1)}
                >
                  {checkBox.link && '내용보기'}
                </button>
              </div>
            ))}
          </div>
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
          회원가입
        </button>
      </form>
    </section>
  );
}
