// src/app/(provider)/(root)/page.tsx
import React from 'react';
import Link from 'next/link'; // Next.js Link 사용
import { CodeCategoryData, qnaData, insightData } from "@/components/dumy"; // 더미 데이터 임포트

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

      <section className='w-full min-h-screen'>
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
        <section className="container mx-auto px-4 py-8 h-auto">
          <h2 className="text-2xl font-bold mb-4">커뮤니티</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">QnA</h2>
                <a href="#" className="text-blue-500">
                  더보기
                </a>
              </div>
              <div className="flex flex-col justify-between mt-5">
                {qnaData.map((item) => (
                  <p key={item.id} className="mb-5">{item.title} <span className="text-gray-500">{item.date}</span></p>
                ))}
              </div>
            </div>

            <div className="bg-gray-200 p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">인사이트</h2>
                <a href="#" className="text-blue-500">
                  더보기
                </a>
              </div>
              <div className="flex flex-col justify-between mt-5">
                {insightData.map((item) => (
                  <p key={item.id} className="mb-5">
                    {item.title} <span className="text-gray-500">{item.date}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* 전문가 */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">전문가 의뢰 목록</h2>
          <Link href="/pro" className="text-blue-500">
            더보기
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow rounded">
            <div className="w-full h-48 bg-gray-300 mb-4"></div>
            <h3 className="font-bold">의뢰 타이틀</h3>
            <p>가격</p>
            <span className="text-gray-500">개발 언어</span>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <div className="w-full h-48 bg-gray-300 mb-4"></div>
            <h3 className="font-bold">의뢰 타이틀</h3>
            <p>가격</p>
            <span className="text-gray-500">개발 언어</span>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <div className="w-full h-48 bg-gray-300 mb-4"></div>
            <h3 className="font-bold">의뢰 타이틀</h3>
            <p>가격</p>
            <span className="text-gray-500">개발 언어</span>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <div className="w-full h-48 bg-gray-300 mb-4"></div>
            <h3 className="font-bold">의뢰 타이틀</h3>
            <p>가격</p>
            <span className="text-gray-500">개발 언어</span>
          </div>
        </div>
      </section>
    </main>
  );
}
