'use client';

import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import clsx from 'clsx';
import { useRef, useState } from 'react';

// async function signUp(formData) {
//   const { email, password, nickname, birth } = formData;
//   const { data, error } = await supabase.auth.Signup({
//     email,
//     password
//   });
//   if (error) {
//     console.error(error);
//     // 에러 처리
//     return;
//   }

//   // TODO: supabase.from 치면 테이블 나오도록 구현해야 함 -> 스탠다드 17차
//   const { data: signUpData, error: signUpError } = await supabase.from('users').insert({ email, nickname });
//   if (signUpError) {
//     console.error(error);
//     // 에러 처리
//     return;
//   }

//   return signUpData;
// }

const inputs = [
  { label: '이메일', type: 'email', id: 'email' },
  { label: '비밀번호', type: 'password', id: 'pw' },
  { label: '비밀번호 확인', type: 'password', id: 'pw-check' },
  { label: '닉네임', type: 'text', id: 'nickname' },
  { label: '이름', type: 'text', id: 'name' },
  { label: '생년월일', type: 'text', id: 'birth', add: 'ex)19990101' }
];

const checkBoxes = [
  // { label: '전체 동의' },
  { label: '서비스 이용약관 동의 (필수)' },
  { label: '개인정보 수집 및 이용 동의 (필수)' },
  { label: '만 14세 이상입니다. (필수)' },
  { label: '마케팅 수신 동의 (선택)' }
];

export default function SignUpForm() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [inputValues, setInputValue] = useState<(string | null)[]>(Array(inputs.length).fill(''));

  const [isChecked, setIsChecked] = useState<boolean[]>(Array(checkBoxes.length).fill(false));

  const divClassName = 'flex flex-col items-center';
  const inputClassName = 'h-[56px] w-[400px] border border-main p-[16px] rounded-[8px]';

  const handleInputChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...inputValues];
    newValues[idx] = e.target.value;
    setInputValue(newValues);
  };

  const handleCheckBoxChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...isChecked];
    newValues[idx] = e.target.checked;
    setIsChecked(newValues);
  };

  return (
    <section className="border border-main flex flex-col gap-[10px] text-center items-center py-[20px]">
      <h2 className="font-bold text-[24px] mb-[48px]">회원가입</h2>
      {inputs.map((input, idx) => (
        <div key={idx} className={clsx(divClassName, idx % 3 === 2 && 'mb-[48px]')}>
          <label
            className={clsx(idx === selectedIdx || inputValues[idx]!.length > 0 ? 'flex' : 'hidden', 'self-start')}
            htmlFor={input.id}
          >
            {input.label}
          </label>
          <input
            className={inputClassName}
            type={input.type}
            id={input.id}
            placeholder={input.add ? `${input.label} ${input.add}` : input.label}
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
        {/* TODO: "전체 동의" 체크박스를 누르면, 밑에 4개의 체크박스를 모두 체크표시 해야 함 */}
        {/* TODO: "전체 동의" 체크박스를 누르지 않고, 밑에 4개의 체크박스를 하나씩 눌러서 4개의 체크박스가 모두 체크가 된 경우에는, "전체 동의" 체크박스에도 체크표시 해야 함 */}
        {/* "전체 동의" 체크박스에 체크가 되었을 경우에만 "회원가입" 버튼이 활성화되어야 함 */}
        {/* 아예 버튼을 누르지 못하게 할건지, 버튼을 누르면 알럿메시지가 뜨게 할건지? */}
        <div className="font-bold">
          <input type="checkbox" /> 전체 동의
        </div>
        <div className="flex flex-col gap-[16px]">
          {checkBoxes.map((checkBox, idx) => (
            <div key={idx}>
              <input type="checkbox" checked={isChecked[idx]} onChange={(e) => handleCheckBoxChange(idx, e)} />{' '}
              {checkBox.label}
            </div>
          ))}
        </div>
      </div>

      <button className="h-[56px] w-[400px] rounded-[8px] bg-black text-white">회원가입</button>
    </section>
  );
}
