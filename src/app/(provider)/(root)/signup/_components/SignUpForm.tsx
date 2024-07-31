'use client';

import clsx from 'clsx';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { validateForms } from './Validate';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';
import Modal from './Modal';

const inputs = [
  { label: '이메일', type: 'text', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw', icon: true },
  { label: '비밀번호 확인', type: 'password', id: 'pwCheck', icon: true },
  { label: '닉네임', type: 'text', id: 'nickname' },
  { label: '이름', type: 'text', id: 'name' },
  { label: '생년월일', type: 'text', id: 'birth', add: 'ex)19990101' }
];

const checkBoxes = [
  { label: '만 14세 이상입니다. (필수)', id: 'age' },
  { label: `서비스 이용약관 동의 (필수)`, id: 'service', link: true },
  { label: '개인정보 수집 및 이용 동의 (필수)', id: 'personal', link: true },

  { label: '마케팅 수신 동의 (선택)', id: 'marketing', link: true }
];

export default function SignUpForm() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<string[]>(Array(inputs.length).fill(''));
  const [showPassword, setShowPassword] = useState<boolean[]>(Array(2).fill(false));
  const [showModal, setShowModal] = useState<number | null>(null);
  const [inputMsgs, setInputMsgs] = useState<(string | boolean)[]>(Array(inputs.length).fill(''));
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [areChecked, setAreChecked] = useState<boolean[]>(Array(checkBoxes.length).fill(false));
  const [emailData, setEmailData] = useState<string[]>(['']);
  const [nicknameData, setNicknameData] = useState<string[]>(['']);
  // 회원가입 버튼 연속으로 누르는 거 막기 -> 이거 안하면 연속으로 눌렀을 때 이미 있는 유저라는 supabase 자체 에러 뜸
  const [throttling, setThrottling] = useState<boolean>(false);

  const router = useRouter();

  const { login, setUserId, setUserData } = useAuthStore();

  useEffect(() => {
    const fetchNicknameData = async () => {
      const response = await fetch('/api/signup');
      const result = await response.json();
      setEmailData(result.emailData);
      setNicknameData(result.nicknameData);
    };
    fetchNicknameData();
  }, []);

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

  const handleTogglePassword = (idx: number): void => {
    const newVisibility = [...showPassword];
    newVisibility[idx] = !newVisibility[idx];
    setShowPassword(newVisibility);
  };

  const handleOneCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const checkedOrNot: boolean = e.target.checked;
    setIsChecked(checkedOrNot);
    if (checkedOrNot) setAreChecked(areChecked.fill(true));
    else setAreChecked(areChecked.fill(false));
  };

  const handleFourCheckBoxesChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValues: boolean[] = [...areChecked];
    newValues[idx] = e.target.checked;
    setAreChecked(newValues);
    const allCheckedOrNot: boolean[] = newValues.filter((value) => !value);
    if (allCheckedOrNot.length === 0) setIsChecked(true);
    else setIsChecked(false);
  };

  const handleOpenModal = (idx: number): void => {
    setShowModal(idx);
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleUserDataSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    const areInputValuesNull: string[] = inputValues.filter((value) => value === '');

    if (inputMsgs[0] !== true && inputMsgs[0] !== '') {
      inputRefs.current[0]!.focus();
      return;
    } else if (inputMsgs[1] !== true && inputMsgs[1] !== '') {
      inputRefs.current[1]!.focus();
      return;
    } else if (inputMsgs[2] !== true && inputMsgs[2] !== '') {
      inputRefs.current[2]!.focus();
      return;
    } else if (inputMsgs[3] !== true && inputMsgs[3] !== '') {
      inputRefs.current[3]!.focus();
    } else if (inputMsgs[4] !== true && inputMsgs[4] !== '') {
      inputRefs.current[4]!.focus();
      return;
    } else if (inputMsgs[5] !== true && inputMsgs[5] !== '') {
      inputRefs.current[5]!.focus();
      return;
    } else if (areInputValuesNull.length !== 0) {
      return alert('회원 정보를 모두 기입해주세요.');
    } else if (!areChecked[0] || !areChecked[1] || !areChecked[2]) {
      return alert('모든 필수 사항에 체크해주세요.');
    } else {
      console.log('모든 조건 충족!');
      setThrottling(true);
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const email: string = formData.get('email') as string;
      const password: string = formData.get('pw') as string;
      const nickname: string = formData.get('nickname') as string;
      const name: string = formData.get('name') as string;
      const birth: string = formData.get('birth') as string;

      const dataForSubmit = { email, password, nickname, name, birth };
      const data = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForSubmit)
      }).then((res) => res.json());

      if (data.errorMsg) {
        alert(data.errorMsg);
        return;
      }

      console.log('회원가입 성공!');
      form.reset();
      login();
      setUserId(data.userData.user.id);
      setUserData(data.userData.user.user_metadata);

      router.replace('signup/signUpComplete');
    }
  };

  return (
    <section>
      {showModal !== null && <Modal onClose={handleCloseModal} modalNum={showModal} />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!throttling) handleUserDataSubmit(e);
        }}
        className="flex flex-col gap-[10px] items-center py-[64px]"
      >
        <h2 className="font-bold text-[24px] mb-[48px]">회원가입</h2>
        {inputs.map((input, idx) => (
          <div key={idx} className={clsx(idx % 3 === 2 && 'mb-[48px]', 'flex flex-col items-center relative')}>
            <div
              className={clsx(
                idx === selectedIdx || inputValues[idx]!.length > 0
                  ? 'h-[70px] w-[400px] border border-black rounded-[8px] px-[16px] pt-[6px]'
                  : 'h-[56px] w-[400px] border border-main p-[16px] rounded-[8px]'
              )}
            >
              <label
                className={clsx(
                  idx === selectedIdx || inputValues[idx]!.length > 0 ? 'flex' : 'hidden',
                  'self-start text-[12px]'
                )}
                htmlFor={input.id}
              >
                {input.label}
              </label>
              <div className="flex">
                <input
                  className={clsx(
                    (idx === selectedIdx || inputValues[idx]!.length > 0) &&
                      'w-[312px] outline-none border-none p-0 mt-[5px]'
                    // : 'h-[56px] w-[400px] border border-main p-[16px] rounded-[8px]'
                  )}
                  type={showPassword[idx - 1] ? 'text' : input.type} // 이 부분 수정할 수 있음
                  id={input.id}
                  name={input.id}
                  placeholder={idx === selectedIdx ? '' : input.add ? `${input.label} ${input.add}` : input.label}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  onClick={() => setSelectedIdx(idx)}
                  value={inputValues[idx] || ''}
                  onChange={(e) => handleInputChange(idx, e)}
                />

                {input.icon && (
                  <button type="button" className="flex items-center" onClick={() => handleTogglePassword(idx - 1)}>
                    <svg
                      className={clsx(
                        'absolute right-[16px] cursor-pointer',
                        showPassword[idx - 1] ? 'block' : 'hidden'
                      )}
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.9997 12.2241C14.9997 13.881 13.6566 15.2241 11.9997 15.2241C10.3429 15.2241 8.99971 13.881 8.99971 12.2241C8.99971 10.5673 10.3429 9.22412 11.9997 9.22412C13.6566 9.22412 14.9997 10.5673 14.9997 12.2241Z"
                        stroke="black"
                      />
                      <path
                        d="M19.1613 11.1526C19.5612 11.6211 19.7611 11.8554 19.7611 12.2241C19.7611 12.5929 19.5612 12.8271 19.1613 13.2957C17.8496 14.8324 15.1353 17.4792 11.9997 17.4792C8.8641 17.4792 6.14983 14.8324 4.83814 13.2957C4.43823 12.8271 4.23828 12.5929 4.23828 12.2241C4.23828 11.8554 4.43823 11.6211 4.83814 11.1526C6.14983 9.6158 8.8641 6.96899 11.9997 6.96899C15.1353 6.96899 17.8496 9.6158 19.1613 11.1526Z"
                        stroke="black"
                      />
                    </svg>
                    <svg
                      className={clsx(
                        'absolute right-[16px] cursor-pointer',
                        showPassword[idx - 1] ? 'hidden' : 'block'
                      )}
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clipRule="evenodd"
                        d="M6.47352 8.81945C5.6371 9.51906 4.94926 10.2522 4.45783 10.828L4.39811 10.8977C4.05659 11.296 3.73828 11.6672 3.73828 12.2241C3.73828 12.7811 4.05659 13.1523 4.39811 13.5505L4.45783 13.6203C5.12934 14.407 6.16759 15.4877 7.45054 16.375C8.73034 17.2601 10.292 17.9792 11.9997 17.9792C13.0481 17.9792 14.0414 17.7082 14.9482 17.2942L14.1866 16.5326C13.4863 16.8115 12.752 16.9792 11.9997 16.9792C10.5718 16.9792 9.20853 16.375 8.01937 15.5525C6.83335 14.7322 5.85862 13.7211 5.21845 12.9711C4.7818 12.4595 4.73828 12.3723 4.73828 12.2241C4.73828 12.076 4.7818 11.9888 5.21845 11.4772C5.70101 10.9118 6.37367 10.1981 7.18363 9.52956L6.47352 8.81945ZM8.70219 11.0481C8.5711 11.4157 8.49971 11.8116 8.49971 12.2241C8.49971 14.1571 10.0667 15.7241 11.9997 15.7241C12.4123 15.7241 12.8082 15.6527 13.1757 15.5216L12.3534 14.6993C12.2378 14.7157 12.1198 14.7241 11.9997 14.7241C10.619 14.7241 9.49971 13.6048 9.49971 12.2241C9.49971 12.1041 9.50818 11.986 9.52454 11.8705L8.70219 11.0481ZM11.6457 9.74899L10.8234 8.9267C11.191 8.79554 11.587 8.72412 11.9997 8.72412C13.9327 8.72412 15.4997 10.2911 15.4997 12.2241C15.4997 12.6368 15.4283 13.0328 15.2971 13.4004L14.4748 12.5781C14.4912 12.4625 14.4997 12.3443 14.4997 12.2241C14.4997 10.8434 13.3804 9.72412 11.9997 9.72412C11.8795 9.72412 11.7613 9.7326 11.6457 9.74899ZM16.8156 14.9189C17.6256 14.2503 18.2984 13.5365 18.781 12.9711C19.2176 12.4595 19.2611 12.3723 19.2611 12.2241C19.2611 12.076 19.2176 11.9888 18.781 11.4772C18.1408 10.7272 17.1661 9.71601 15.9801 8.89572C14.7909 8.07327 13.4276 7.46899 11.9997 7.46899C11.2474 7.46899 10.5129 7.63675 9.8125 7.91579L9.05092 7.1542C9.95785 6.74007 10.9513 6.46899 11.9997 6.46899C13.7074 6.46899 15.2691 7.18812 16.5489 8.07327C17.8318 8.96059 18.8701 10.0412 19.5416 10.828L19.6013 10.8977L19.6013 10.8977C19.9428 11.296 20.2611 11.6672 20.2611 12.2241C20.2611 12.7811 19.9428 13.1523 19.6013 13.5505L19.5416 13.6203C19.0501 14.1961 18.3622 14.9293 17.5257 15.629L16.8156 14.9189Z"
                        fill="black"
                      />
                      <path
                        fill-rule="evenodd"
                        clipRule="evenodd"
                        d="M3.67184 3.89596C3.8671 3.7007 4.18368 3.7007 4.37894 3.89596L20.328 19.8451C20.5233 20.0403 20.5233 20.3569 20.328 20.5522C20.1328 20.7474 19.8162 20.7474 19.6209 20.5522L3.67184 4.60307C3.47658 4.4078 3.47658 4.09122 3.67184 3.89596Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="self-start text-[14px] mt-[3px] ml-[3px] text-[red]">{inputMsgs[idx]}</p>
          </div>
        ))}

        {/* <div className="h-[240px] w-[400px] border text-left mb-[48px]">
        <p>관심 언어</p>
      </div> */}

        <div className="h-[240px] w-[400px] mb-[48px] bg-grey-50 rounded-[8px] px-[16px] py-[24px] flex flex-col gap-[24px] text-left">
          <div className="font-bold flex gap-[8px] items-center">
            <input
              className="custom-checkbox"
              type="checkbox"
              id="all-agree"
              checked={isChecked}
              onChange={(e) => handleOneCheckBoxChange(e)}
            />
            <label htmlFor="all-agree">전체 동의</label>
          </div>
          <div className="flex flex-col gap-[16px] text-grey-400">
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
                  className="text-[12px] underline content-center"
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
            throttling && 'hover: cursor-default bg-black text-white bg-opacity-40 text-opacity-50',
            'h-[56px] w-[400px] rounded-[8px] bg-primary-500 hover:bg-primary-700 text-white font-bold'
          )}
        >
          회원가입
        </button>
      </form>
    </section>
  );
}
