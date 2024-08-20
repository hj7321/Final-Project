import useCreateCard from '@/hooks/useCreateCard';
import { useState } from 'react';

interface SubmitButtonProps {
  handleFormSubmit: () => void;
  disableBtn: boolean;
}

export default function SubmitButton({ handleFormSubmit, disableBtn }: SubmitButtonProps) {
  return (
    <button
      className={`w-full md:p-5 p-3 rounded-md ${disableBtn ? 'bg-grey-200' : 'bg-primary-500 hover:bg-primary-600'}`}
      onClick={handleFormSubmit}
      disabled={disableBtn} // 버튼 비활성화 여부
    >
      <span className="text-white md:text-base text-sm">등록하기</span>
    </button>
  );
}
