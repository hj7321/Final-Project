'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { dummyData, DummyDataType } from '@/components/dumy'; // 검색 더미 데이터 임포트

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState<DummyDataType[]>([]);
  const [filteredResults, setFilteredResults] = useState<DummyDataType[]>([]);

  useEffect(() => {
    if (query) {
      const lowerQuery = query.toLowerCase();
      const filteredResults = dummyData.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.codeCategory.name.toLowerCase().includes(lowerQuery)
      );
      setResults(filteredResults);
      setFilteredResults(filteredResults);
    }
  }, [query]);

  const handleFilter = (category: string) => {
    const filtered = results.filter(item => item.category === category);
    setFilteredResults(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">검색 결과</h1>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setFilteredResults(results)} className="px-4 py-2 bg-gray-300 rounded">전체</button>
        <button onClick={() => handleFilter('Q&A')} className="px-4 py-2 bg-gray-300 rounded">Q&A</button>
        <button onClick={() => handleFilter('인사이트')} className="px-4 py-2 bg-gray-300 rounded">인사이트</button>
        <button onClick={() => handleFilter('전문가 의뢰')} className="px-4 py-2 bg-gray-300 rounded">전문가 의뢰</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredResults.map(result => (
          <div key={result.id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold">{result.title}</h2>
            <p>{result.content}</p>
            <p className="text-gray-500">{result.nickname}</p>
            <div className="flex space-x-2 mt-2">
              <span className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-sm">{result.codeCategory.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
