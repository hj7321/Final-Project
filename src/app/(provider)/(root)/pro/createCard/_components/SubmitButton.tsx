interface SubmitButtonProps {
  handleSubmit : () => void
}

export default function SubmitButton({ handleSubmit} : SubmitButtonProps) {
  return (
    <button className="w-full p-5 border-2 border-slate-400 rounded-md" onClick={handleSubmit}>
      등록하기
    </button>
  )
}