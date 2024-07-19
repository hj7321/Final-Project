import Link from 'next/link';
import ProDetail from './proDetail/[id]/page';

export default function proMainPage() {
  const param = '123';
  return (
    <div>
      {/* 언어별 카테고리 영역 */}
      <div className="my-[70px] mx-auto ">
        <ul className="flex flex-row justify-between items-center mt-[50px] max-w-7xl mx-auto">
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-red-400 mb-[10px] mx-auto"></div>
            <p className="text-center">HTML/CSS</p>
          </li>
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-yellow-400 mb-[10px] mx-auto"></div>
            <p className="text-center">Javascript</p>
          </li>
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-orange-400 mb-[10px] mx-auto"></div>
            <p className="text-center">Java</p>
          </li>
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-blue-400 mb-[10px] mx-auto"></div>
            <p className="text-center">Python</p>
          </li>
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-violet-400 mb-[10px] mx-auto"></div>
            <p className="text-center">C / C# / C++</p>
          </li>
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-cyan-400 mb-[10px] mx-auto"></div>
            <p className="text-center">React</p>
          </li>
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-blue-900 mb-[10px] mx-auto"></div>
            <p className="text-center">Typescript</p>
          </li>
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-indigo-200 mb-[10px] mx-auto"></div>
            <p className="text-center">Android / IOS APP</p>
          </li>
          <li className="mx-[20px] flex-col justify-center items-center hover:cursor-pointer">
            <div className="w-[80px] h-[80px] bg-red-200 mb-[10px] mx-auto"></div>
            <p className="text-center">Git / Github</p>
          </li>
        </ul>
      </div>

      {/* 경력 버튼 필터링 영역 */}
      <div className="max-w-4xl mx-auto flex justify-between px-[20px] ">
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
        <button className="border-2 p-3 rounded-full">1년 ~ 2년</button>
      </div>

      {/* 의뢰 서비스 리스트 */}
      <div className="max-w-[1440px] mx-auto flex flex-row flex-wrap my-[70px] justify-start">
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
        <Link href={`pro/proDetail/${param}`}>
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
