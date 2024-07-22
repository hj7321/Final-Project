export default function ProDetail() {
  return (
    <div className="max-w-[1280px] mx-auto p-4">
      {/* 헤더 섹션 -> 상품 배너(메인) 이미지 & 판매자 정보 */}
      <div className="flex w-full">
        <div className="w-2/3 h-[500px] bg-yellow-400 mr-[30px]"></div>
        <div className="w-1/3 h-[500px] border-2 border-slate-400 rounded-xl flex flex-col items-center p-4">
          {/* 판매자 정보 - 프로필 이미지 섹션 */}
          <div className="w-[150px] h-[150px] bg-green-400 rounded-full mt-3">
            {/* 나중에 이미지 가 들어가야함 -> 여기에 이미지 태그 추가 or div태그를 이미지 태그로 변경 코드 작성 */}
          </div>
          {/* 판매자 정보 - 닉네임 섹션 */}
          <div className="flex my-4 justify-center items-center">
            <p className="ml-5 text-2xl">닉네임</p>
            <div className="w-[20px] h-[20px] bg-gray-400 mx-2">
              {/* 전문가 뱃지가 들어올 예정*/}
            </div>
          </div>
          {/* 판매자 정보 - 서브 카테고리 1 */}
          <div>
            <div className="flex justify-center items-center my-3">
              <div className="w-[20px] h-[20px] bg-gray-400 mr-2"></div>
              <p className="text-lg">연락 가능 시간</p>
            </div>
            <div className="flex justify-center items-center my-3">
              <div className="w-[20px] h-[20px] bg-gray-400 mr-2"></div>
              <p className="text-lg">평균 응답 시간</p>
            </div>
          </div>
          {/* 판매자 정보 - 서브 카테고리 2 */}
          <div className="mt-[20px] flex justify-center items-center max-w-[300px]">
            <p>전문가에 대한 소개글</p>
          </div>
          <div className="flex-grow"></div>
          {/* 버튼 섹션 */}
          <div className="flex justify-center items-center mt-auto">
            <button className="border-2 border-yellow-400 p-2 w-[170px] bg-yellow-400 rounded-full mx-3">문의하기</button>
            <button className="border-2 border-yellow-400 p-2 w-[170px] bg-yellow-400 rounded-full mx-3">구매하기</button>
          </div>
        </div>
      </div>
      {/* 포트폴리오, 서비스 설명, 리뷰 조회 섹션 */}
      <div className="my-[20px] mx-auto p-4 w-full">
        {/* 카테고리 */}
        <ul className="flex">
          <li className="mx-3 text-xl font-bold">포트폴리오</li>
          <li className="mx-3 text-xl font-bold">서비스설명</li>
          <li className="mx-3 text-xl font-bold">리뷰조회</li>
        </ul>
        {/* 포트폴리오 리스트 섹션 */}
        <div className="flex flex-row flex-wrap justify-start items-start mx-auto mt-[15px]">
          {/* 포트폴리오 카드 */}
          <div className="w-[260px] h-[280px] border-2 border-slate-400 rounded-xl m-5">
            {/* div를 나중에 이미지 태그로 변경해야함 */}
            <div className="w-full h-[150px] bg-blue-200 rounded-xl">이미지</div>
            <div className="p-3">
              <p className="text-xl my-2">포트폴리오 제목</p>
              <p className="text-lg mb-2">가격</p>
              <span className="border border-2 border-slate-400 bg-slate-400 rounded-full p-1">개발언어</span>
            </div>
          </div>
          <div className="w-[260px] h-[280px] border-2 border-slate-400 rounded-xl m-5">
            {/* div를 나중에 이미지 태그로 변경해야함 */}
            <div className="w-full h-[150px] bg-blue-200 rounded-xl">이미지</div>
            <div className="p-3">
              <p className="text-xl my-2">포트폴리오 제목</p>
              <p className="text-lg mb-2">가격</p>
              <span className="border border-2 border-slate-400 bg-slate-400 rounded-full p-1">개발언어</span>
            </div>
          </div>
          <div className="w-[260px] h-[280px] border-2 border-slate-400 rounded-xl m-5">
            {/* div를 나중에 이미지 태그로 변경해야함 */}
            <div className="w-full h-[150px] bg-blue-200 rounded-xl">이미지</div>
            <div className="p-3">
              <p className="text-xl my-2">포트폴리오 제목</p>
              <p className="text-lg mb-2">가격</p>
              <span className="border border-2 border-slate-400 bg-slate-400 rounded-full p-1">개발언어</span>
            </div>
          </div>
          <div className="w-[260px] h-[280px] border-2 border-slate-400 rounded-xl m-5">
            {/* div를 나중에 이미지 태그로 변경해야함 */}
            <div className="w-full h-[150px] bg-blue-200 rounded-xl">이미지</div>
            <div className="p-3">
              <p className="text-xl my-2">포트폴리오 제목</p>
              <p className="text-lg mb-2">가격</p>
              <span className="border border-2 border-slate-400 bg-slate-400 rounded-full p-1">개발언어</span>
            </div>
          </div>
          <div className="w-[260px] h-[280px] border-2 border-slate-400 rounded-xl m-5">
            {/* div를 나중에 이미지 태그로 변경해야함 */}
            <div className="w-full h-[150px] bg-blue-200 rounded-xl">이미지</div>
            <div className="p-3">
              <p className="text-xl my-2">포트폴리오 제목</p>
              <p className="text-lg mb-2">가격</p>
              <span className="border border-2 border-slate-400 bg-slate-400 rounded-full p-1">개발언어</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}