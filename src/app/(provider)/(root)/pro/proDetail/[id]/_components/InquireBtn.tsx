
interface InquireBtnProps {
  handleInquiry : () => void
}

export default function InquireBtn({handleInquiry} : InquireBtnProps) {
  return (
    <div className="md:w-[150px] md:h-[56px] md:mx-1">
    <button
      className="md:w-full md:h-full w-[160px] h-[36px] bg-primary-500 hover:bg-primary-600 py-2  rounded-xl flex flex-row justify-center items-center"
      onClick={handleInquiry}
    >
      {' '}
      <span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.9488 15.1464L15.3133 19.8976C15.9018 20.5383 16.9712 20.1738 17.046 19.3071L18.2924 4.86566C18.3632 4.04436 17.4658 3.49486 16.7665 3.93141L4.47075 11.6075C3.73276 12.0682 3.89438 13.1864 4.73262 13.4193L10.9488 15.1464ZM10.9488 15.1464L15.2052 8.19459"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-white md:text-base text-sm">문의하기</span>
    </button>
  </div>
  )
}