export default function Home() {
  return (
    <main className="bg-gray-100">
      {/* 메인베너 */}
      <section
        className="w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://img.freepik.com/free-photo/3d-render-of-a-coastal-landscape-on-a-sunset-sky_1048-5670.jpg')" }}
      >
        <span className="text-white text-2xl bg-black bg-opacity-50 px-4 py-2 rounded">메인 배너</span>
      </section>

      <section className='w-full h-screen '>
        {/* 카테고리 */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex space-x-4 overflow-x-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <span className="mt-2 text-black">디자인</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <span className="mt-2 text-black">IT·프로그래밍</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <span className="mt-2 text-black">영상·사진·음향</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <span className="mt-2 text-black">마케팅</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <span className="mt-2 text-black">번역·통역</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <span className="mt-2 text-black">음악·예능·교양</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <span className="mt-2 text-black">문서·사무</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <span className="mt-2 text-black">세무·법무·노무</span>
              </div>
            </div>
          </div>
        </section>

        {/* 커뮤니티섹션 */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">QnA 게시판</h2>
              <a href="#" className="text-blue-500">
                바로가기
              </a>
            </div>
            <div className="bg-gray-200 p-4">
              <p>오늘의 QnA 인기글 색 다르게 해서 3개</p>
              <p>오늘의 QnA 최신글 주르륵</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">인사이트 게시판</h2>
              <a href="#" className="text-blue-500">
                바로가기
              </a>
            </div>
            <div className="bg-gray-200 p-4">
              <p>오늘의 인사이트 인기글 색 다르게 해서 3개</p>
              <p>오늘의 인사이트 최신글 주르륵</p>
            </div>
          </div>
        </section>
      </section>
      
      {/* 전문가  */}
      <section className="container w-full h-screen mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">전문가</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow">
            <img src="https://via.placeholder.com/150" alt="Service 1" className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold">전문가1</h3>
            <p>전문가설명...</p>
          </div>
          <div className="bg-white p-4 shadow">
            <img src="https://via.placeholder.com/150" alt="Service 2" className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold">전문가2</h3>
            <p>전문가 설명...</p>
          </div>
          <div className="bg-white p-4 shadow">
            <img src="https://via.placeholder.com/150" alt="Service 3" className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold">전문가 3</h3>
            <p>전문가 설명...</p>
          </div>
          <div className="bg-white p-4 shadow">
            <img src="https://via.placeholder.com/150" alt="Service 4" className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold">전문가 4</h3>
            <p>전문가 설명...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
