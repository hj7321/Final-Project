
export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      {/* 로고 */}
      <div className="flex items-center">
        <div className="w-20 h-20 bg-gray-300 flex items-center justify-center">
          <span className="text-black text-lg">로고</span>
        </div>
        <nav className="ml-4 space-x-4">
          <a href="#" className="text-black">
            Q & A
          </a>
          <a href="#" className="text-black">
            인사이트
          </a>
          <a href="#" className="text-black">
            전문가 의뢰
          </a>
        </nav>
      </div>

      {/* 검색창 */}
      <div className="flex items-center bg-gray-200 rounded-full px-4 py-2">
        <input type="text" placeholder="Search" className="bg-gray-200 outline-none" />
        <button>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M16.65 16.65A7.65 7.65 0 1116.65 1.35a7.65 7.65 0 010 15.3z"
            ></path>
          </svg>
        </button>
      </div>

      {/* 로그인 및 회원가입 */}
      <div className="space-x-4">
        <a href="#" className="text-black">
          로그인
        </a>
        <a href="#" className="text-black">
          일반 회원가입
        </a>
        <a href="#" className="text-black">
          전문가 회원가입
        </a>
      </div>
    </header>
  );
}
