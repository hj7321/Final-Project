interface PurchaseBtnProps {
  handleAccount: () => void;
}

export default function PurChaseBtn({ handleAccount }: PurchaseBtnProps) {
  return (
    <div className="md:w-[150px] md:h-[56px] md:mx-1">
      <button
        onClick={handleAccount}
        className="md:w-full md:h-full w-[160px] h-[36px] hover:bg-primary-50 border-primary-500 border py-2 rounded-xl flex flex-row justify-center items-center"
      >
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.32031 14.4888V15.7877C8.32031 15.9271 8.43335 16.0402 8.57278 16.0402H18.3448"
              stroke="#253CE5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9.42245" cy="17.9488" r="1.22323" stroke="#253CE5" />
            <circle cx="17.2389" cy="17.9488" r="1.22323" stroke="#253CE5" />
            <path
              d="M4 5H5.94401C6.06306 5 6.16593 5.08316 6.19087 5.19957L6.88789 8.45232M6.88789 8.45232L8.17673 14.4669C8.20168 14.5833 8.30455 14.6665 8.4236 14.6665H18.3753C18.493 14.6665 18.5951 14.5851 18.6214 14.4704L19.9292 8.76117C19.9655 8.60307 19.8453 8.45232 19.6832 8.45232H6.88789Z"
              stroke="#253CE5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-primary-500 md:text-base text-sm">구매하기</span>
      </button>
    </div>
  );
}
