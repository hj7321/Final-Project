'use client';

import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import clsx from 'clsx';
import { useRef, useState } from 'react';

const signUp = async (formData) => {
  const { email, password, nickname, name, birth } = formData;
  const { data, error } = await supabase.auth.Signup({
    email,
    password
  });
  if (error) {
    console.error(error);
    // 에러 처리
    return;
  }

  // TODO: supabase.from 치면 테이블 나오도록 구현해야 함 -> 스탠다드 17차
  const { data: signUpData, error: signUpError } = await supabase.from('users').insert({ email, nickname });
  if (signUpError) {
    console.error(error);
    // 에러 처리
    return;
  }

  return signUpData;
};

const inputs = [
  { label: '이메일', type: 'email', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw' },
  { label: '비밀번호 확인', type: 'password', id: 'pw-check' },
  { label: '닉네임', type: 'text', id: 'nickname' },
  { label: '이름', type: 'text', id: 'name' },
  { label: '생년월일', type: 'text', id: 'birth', add: 'ex)19990101' }
];

const checkBoxes = [
  { label: '서비스 이용약관 동의 (필수)', id: 'service' },
  { label: '개인정보 수집 및 이용 동의 (필수)', id: 'personal' },
  { label: '만 14세 이상입니다. (필수)', id: 'age' },
  { label: '마케팅 수신 동의 (선택)', id: 'marketing' }
];

export default function SignUpForm() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputValues, setInputValue] = useState<(string | null)[]>(Array(inputs.length).fill(''));
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [areChecked, setAreChecked] = useState<boolean[]>(Array(checkBoxes.length).fill(false));

  const divClassName = 'flex flex-col items-center';
  const inputClassName = 'h-[56px] w-[400px] border border-main p-[16px] rounded-[8px';

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

  return (
    <section className="border border-main flex flex-col gap-[10px] text-center items-center py-[20px]">
      <h2 className="font-bold text-[24px] mb-[48px]">회원가입</h2>
      {inputs.map((input, idx) => (
        <div
          key={idx}
          className={clsx(divClassName, idx % 3 === 2 && 'mb-[48px]', 'border border-black rounded-[8px]')}
        >
          <label
            className={clsx(idx === selectedIdx || inputValues[idx]!.length > 0 ? 'flex' : 'hidden', 'self-start')}
            htmlFor={input.id}
          >
            {input.label}
          </label>
          <input
            className={clsx(inputClassName, idx === selectedIdx && 'border-none')}
            type={input.type}
            id={input.id}
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

      <div className="h-[240px] w-[400px] border text-left mb-[48px]">
        <p>관심 언어</p>
      </div>

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
              <label htmlFor={checkBox.id}>{checkBox.label}</label>
            </div>
          ))}
        </div>
      </div>

      <button className="h-[56px] w-[400px] rounded-[8px] bg-black text-white">회원가입</button>
    </section>
  );
}
