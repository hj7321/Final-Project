"use client"

import useCreateCard from '@/hooks/useCreateCard';
import Link from 'next/link';
import { useEffect } from 'react';

export default function proMainPage() {
  const { codeLang } = useCreateCard()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('api/proMain')
      const data = response.json()
      console.log(data)
    }
    fetchData()
  },[])
  return (
    <div className='max-w-[1440px] mx-auto flex-col justify-center items-center'>
      {/* 언어별 카테고리 영역 */}
      <div className="my-[70px] mx-auto ">
        <ul className="flex flex-row justify-between items-center mt-[50px] max-w-7xl mx-auto">
          {codeLang.map((lang, index) => (
            <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer" key={index}>
              <div className="w-[80px] h-[80px] bg-slate-400 rounded-full mb-[10px] mx-auto">
              </div>
              <p className="text-center">{lang}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 경력 버튼 필터링 영역 */}
      <div className="max-w-4xl mx-auto flex justify-between px-[20px] ">
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
        <button className="border-2 p-3 rounded-full">2년 ~ 4년</button>
        <button className="border-2 p-3 rounded-full">4년 ~ 5년</button>
        <button className="border-2 p-3 rounded-full">5년 ~ 6년</button>
        <button className="border-2 p-3 rounded-full">6년 ~ 8년</button>
        <button className="border-2 p-3 rounded-full">8년 이상</button>
      </div>

      {/* 의뢰 서비스 리스트 */}
      <div className="max-w-[1440px] mx-auto flex flex-row flex-wrap my-[70px] justify-start">
        <Link href={`pro/proDetail/1`}>
          <div className="w-[300px] h-[400px] border-2 border-black rounded-lg m-[30px]">
            <div className="w-full h-[200px] bg-yellow-400 rounded-lg">이미지</div>
            <div className="flex-col p-2">
              <p className="text-2xl mb-2">코드 리뷰 함</p>
              <hr />
              <p className="text-xl mt-2">타입스크립트 코드리뷰 해줌</p>
              <p className="text-xl ">가격 : 10000</p>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
