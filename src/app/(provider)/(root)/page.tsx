import React from 'react';
import { CodeCategoryData } from '@/components/dumy';

export default function Home() {
  return (
    <main className="bg-gray-100">
      {/* 메인베너 */}
      <section
        className="w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2012/08/25/22/22/saturn-54999_1280.jpg')" }}
      >
        <span className="text-white text-2xl bg-black bg-opacity-50 px-4 py-2 rounded">메인 배너</span>
      </section>

      <section className="w-full min-h-screen">
        {/* 카테고리 */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">언어별 카테고리</h2>
            <div className="flex justify-between overflow-x-auto">
              {CodeCategoryData.map((category) => (
                <div key={category.id} className="flex flex-col items-center mx-2">
                  <img src={category.image} alt={category.name} className="w-24 h-24 bg-gray-300 rounded-full" />
                  <span className="mt-2 text-black text-lg">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 커뮤니티섹션 */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">커뮤니티</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">QnA</h2>
                <a href="#" className="text-blue-500">
                  더보기
                </a>
              </div>
              <div>
                <p className="mb-2">
                  타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
                <p className="mb-2">
                  타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
                <p className="mb-2">
                  타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
                <p className="mb-2">
                  타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
                <p className="mb-2">
                  타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-200 p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">인사이트</h2>
                <a href="#" className="text-blue-500">
                  더보기
                </a>
              </div>
              <div>
                <p className="mb-2">
                  🔥 타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
                <p className="mb-2">
                  🔥 타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
                <p className="mb-2">
                  🔥 타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
                <p className="mb-2">
                  타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
                <p className="mb-2">
                  타이틀타이틀타이틀타이틀타이틀 <span className="text-gray-500">2024.07.19</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* 전문가  */}
      <section className="container w-full min-h-screen mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">전문가</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow">
            <img src="https://via.placeholder.com/150" alt="Service 1" className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold">전문가1</h3>
            <p>전문가 설명...</p>
          </div>
          <div className="bg-white p-4 shadow">
            <img src="https://via.placeholder.com/150" alt="Service 2" className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold">전문가2</h3>
            <p>전문가 설명...</p>
          </div>
          <div className="bg-white p-4 shadow">
            <img src="https://via.placeholder.com/150" alt="Service 3" className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold">전문가3</h3>
            <p>전문가 설명...</p>
          </div>
          <div className="bg-white p-4 shadow">
            <img src="https://via.placeholder.com/150" alt="Service 4" className="w-full h-40 object-cover mb-4" />
            <h3 className="font-bold">전문가4</h3>
            <p>전문가 설명...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
