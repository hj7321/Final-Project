// components/SkeletonLoader.tsx
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      {/* 메인베너 스켈레톤 */}
      <div className="w-full md:h-[calc(100vh-75px)] bg-gray-300 mb-4"></div>

      {/* 언어별 카테고리 스켈레톤 */}
      <section className="w-full flex flex-col min-h-[calc(100vh-75px)] mb-12 md:mb-64">
        <div className="bg-gray-100 py-4 flex-shrink-0">
          <div className="container mx-auto px-4 md:px-16 h-full">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="flex md:justify-between items-center gap-6 md:gap-4 overflow-x-auto">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col items-center mb-4 md:w-auto items-start">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full"></div>
                  <div className="mt-2 w-12 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 커뮤니티 섹션 스켈레톤 */}
      <section className="w-full flex flex-col min-h-[calc(100vh-75px)] snap-start mb-12 md:mb-64">
        <div className="container mx-auto px-4 md:px-16 flex-grow">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white p-4 border border-gray-100 rounded-xl">
                <div className="flex justify-between items-center mb-10">
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 전문가 섹션 스켈레톤 */}
      <section className="container mx-auto py-4 min-h-[calc(100vh-75px)] flex items-center snap-start">
        <div className="w-full px-4 md:px-16">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white py-4 px-3 flex-shrink-0 w-64 md:w-auto flex flex-col items-start border border-grey-100 rounded-xl">
                <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded mb-2"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded mb-2"></div>
                <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkeletonLoader;
