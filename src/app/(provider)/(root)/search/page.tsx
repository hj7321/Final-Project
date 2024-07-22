'use client';

import React, { useState } from 'react';
import dummyData from '@/components/searchDumy';

export default function Search() {
  const [activeTab, setActiveTab] = useState('Q&A');

  const filteredData = dummyData.filter(item => item.category === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">검색어로 검색한 결과</h1>
      <div className="flex mb-4">
        {['Q&A', '인사이트', '전문가 의뢰'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${activeTab === tab ? 'font-bold text-blue-600' : 'text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        {filteredData.map(item => (
          <div key={item.id} className="mb-4 border-b pb-4">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p>{item.content}</p>
            <span className="text-gray-500">{item.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
