interface SubmitButtonProps {
  handleSubmit : () => void
}

export default function SubmitButton({ handleSubmit} : SubmitButtonProps) {
  return (
    <button className="w-full p-5 bg-primary-500 hover:bg-primary-600 rounded-md" onClick={handleSubmit}>
      <span className="text-white">등록하기</span>
    </button>
  )
}