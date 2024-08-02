interface SubmitButtonProps {
  handleFormSubmit : () => void
}

export default function SubmitButton({ handleFormSubmit } : SubmitButtonProps) {
  return (
    <button className="w-full p-5 bg-primary-500 hover:bg-primary-600 rounded-md" onClick={handleFormSubmit}>
      <span className="text-white">등록하기</span>
    </button>
  )
}