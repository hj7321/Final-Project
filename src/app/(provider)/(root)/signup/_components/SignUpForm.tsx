'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { FormEventHandler, useRef, useState } from 'react';
import { validateBirth, validateEmail, validateName, validateNickName, validatePassword } from './Validate';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';

const inputs = [
  { label: '이메일', type: 'text', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw' },
  { label: '비밀번호 확인', type: 'password', id: 'pw-check' },
  { label: '닉네임', type: 'text', id: 'nickname' },
  { label: '이름', type: 'text', id: 'name' },
  { label: '생년월일', type: 'text', id: 'birth', add: 'ex)19990101' }
];

const checkBoxes = [
  { label: `서비스 이용약관 동의 (필수)`, id: 'service', linkText: '서비스 이용약관' },
  { label: '개인정보 수집 및 이용 동의 (필수)', id: 'personal', linkText: '개인정보 수집 및 이용' },
  { label: '만 14세 이상입니다. (필수)', id: 'age' },
  { label: '마케팅 수신 동의 (선택)', id: 'marketing' }
];

export default function SignUpForm() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputValues, setInputValue] = useState<(string | null)[]>(Array(inputs.length).fill(''));
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [areChecked, setAreChecked] = useState<boolean[]>(Array(checkBoxes.length).fill(false));

  const router = useRouter();

  const { login, setUserId, setUserData } = useAuthStore();

  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValue(newValues);
  };

  const handleOneCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkedOrNot: boolean = e.target.checked;
    setIsChecked(checkedOrNot);
    if (checkedOrNot) setAreChecked(areChecked.fill(true));
    else setAreChecked(areChecked.fill(false));
  };

  const handleFourCheckBoxesChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues: boolean[] = [...areChecked];
    newValues[idx] = e.target.checked;
    setAreChecked(newValues);
    const allCheckedOrNot: boolean[] = newValues.filter((value) => !value);
    if (allCheckedOrNot.length === 0) setIsChecked(true);
    else setIsChecked(false);
  };

  const handleCheckValidation: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email: string = formData.get('email') as string;
    const password: string = formData.get('pw') as string;
    const passwordCheck: string = formData.get('pw-check') as string;
    const nickname: string = formData.get('nickname') as string;
    const name: string = formData.get('name') as string;
    const birth: string = formData.get('birth') as string;

    if (!validateEmail(email)) {
      inputRefs.current[0]!.focus();
      return;
    } else if (!validatePassword(password)) {
      inputRefs.current[1]!.focus();
      return;
    } else if (!passwordCheck) {
      alert('비밀번호를 다시 한 번 입력해주세요.');
      inputRefs.current[2]!.focus();
      return;
    } else if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      inputRefs.current[2]!.focus();
      return;
    } else if (!validateNickName(nickname)) {
      inputRefs.current[3]!.focus();
      return;
    } else if (!validateName(name)) {
      inputRefs.current[4]!.focus();
      return;
    } else if (!validateBirth(birth)) {
      inputRefs.current[5]!.focus();
      return;
    } else if (!areChecked[0] || !areChecked[1] || !areChecked[2]) {
      alert('모든 필수 사항에 체크해주세요.');
    } else {
      alert('모든 조건 충족!');
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
      alert('회원가입 성공!');
      form.reset();
      login();
      console.log(data.userData);
      setUserId(data.userData.user.id);
      setUserData(data.userData.user.user_metadata);

      router.replace('signup/signUpComplete');
    }
  };

  return (
    <form onSubmit={handleCheckValidation} className="flex flex-col gap-[10px] text-center items-center py-[64px]">
      <h2 className="font-bold text-[24px] mb-[48px]">회원가입</h2>
      {inputs.map((input, idx) => (
        <div
          key={idx}
          className={clsx(
            'flex flex-col items-center',
            idx % 3 === 2 && 'mb-[48px]',
            (idx === selectedIdx || inputValues[idx]!.length > 0) &&
              'h-[70px] w-[400px] border border-black rounded-[8px] px-[16px] pt-[6px]'
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
          <input
            className={clsx(
              idx === selectedIdx || inputValues[idx]!.length > 0
                ? 'w-[362px] outline-none border-none p-0 mt-[5px]'
                : 'h-[56px] w-[400px] border border-main p-[16px] rounded-[8px]'
            )}
            type={input.type}
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
        </div>
      ))}

      {/* <div className="h-[240px] w-[400px] border text-left mb-[48px]">
        <p>관심 언어</p>
      </div> */}

      <div className="h-[240px] w-[400px] mb-[48px] border bg-[#ececec] rounded-[8px] px-[16px] py-[24px] flex flex-col gap-[24px] text-left">
        {/* "전체 동의" 체크박스에 체크가 되었을 경우에만 "회원가입" 버튼이 활성화되어야 함 */}
        {/* 아예 버튼을 누르지 못하게 할건지, 버튼을 누르면 알럿메시지가 뜨게 할건지? */}
        <div className="font-bold flex gap-[8px]">
          <input
            className="w-[24px] h-[24px]"
            type="checkbox"
            id="all-agree"
            checked={isChecked}
            onChange={(e) => handleOneCheckBoxChange(e)}
          />
          <label htmlFor="all-agree">전체 동의</label>
        </div>
        <div className="flex flex-col gap-[16px]">
          {checkBoxes.map((checkBox, idx) => (
            <div key={idx} className="flex gap-[8px]">
              <input
                className="w-[24px] h-[24px]"
                type="checkbox"
                id={checkBox.id}
                checked={areChecked[idx]}
                onChange={(e) => handleFourCheckBoxesChange(idx, e)}
              />{' '}
              <label htmlFor={checkBox.id}>
                {checkBox.linkText ? (
                  <>
                    <Link href="#" className="underline">
                      {checkBox.linkText}
                    </Link>{' '}
                    동의 (필수)
                  </>
                ) : (
                  checkBox.label
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="h-[56px] w-[400px] rounded-[8px] bg-black text-white font-bold">
        회원가입
      </button>
      {/* 유효성 검사 모두 통과, 체크박스에 모두 체크하고 나서 회원가입 버튼을 클릭하면 SignUpComplete 컴포넌트로 전환됨 */}
      {/* 이때 이 컴포넌트에서 작성한 회원 정보를 어떻게 들고가야 하지? */}
      {/* 버튼을 눌렀을 때 페이지는 그대로인데 컴포넌트가 바뀌는 상황이다. -> 페이지 분리하는 게 좋겠다 */}
    </form>
  );
}
