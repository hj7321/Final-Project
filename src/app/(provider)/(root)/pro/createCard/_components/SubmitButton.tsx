import useCreateCard from "@/hooks/useCreateCard"
import { useState } from "react"

interface SubmitButtonProps {
  handleFormSubmit : () => void
  disableBtn : boolean
}

export default function SubmitButton({ handleFormSubmit, disableBtn } : SubmitButtonProps) {
  return (
    <button
      className={`w-full p-5 rounded-md ${
        disableBtn ? 'bg-gray-200' : 'bg-primary-500 hover:bg-primary-600'
      }`}
      onClick={handleFormSubmit}
      disabled={disableBtn} // 버튼 비활성화 여부
    >
      <span className="text-white">등록하기</span>
    </button>
  )
}