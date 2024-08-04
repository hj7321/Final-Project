'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession'; // 사용자 세션 커스텀 훅을
import { useChatRoom } from '@/hooks/useChatRoom'; // 채팅 방 관리 커스텀 훅
import ChatModal from '../../../chat/_components/ChatModal'; // 채팅모달컴포넌트
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import PortfolioModal from './_components/PortfolioModal';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface PostData {
  post_img: string[];
  content: string;
}

interface UserData {
  id: string; // 유저 ID 추가
  nickname: string;
  profile_img: string;
}

interface PortfolioData {
  id: string;
  user_id: string;
  title: string;
  content: string;
  portfolio_img: string;
  lang_category: string[];
  start_date: string;
  end_date: string;
}

export default function ProDetail() {
  const [post, setPost] = useState<PostData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);
  const [activeTab, setActiveTab] = useState('service');
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioData | null>(null); // 선택된 포트폴리오
  const { id: paramId } = useParams();
  const id = paramId as string; // 추가: id를 문자열로 변환
  const router = useRouter();

  const { currentUserId } = useSession(); // 추가: 현재 사용자 ID를 가져옴
  const { chatRoomId, isChatOpen, toggleChat, setChatRoomId } = useChatRoom(currentUserId, user?.id || null, id); // 채팅 방 ID, 채팅 창 열림 여부, 채팅 창 토글 함수, 채팅 방 ID 설정 함수를 가져옴

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/proDetail?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('fetch', data);
        setPost(data.postData);
        setUser(data.userData);
        setPortfolio(data.portfolioData);
      } catch (error) {
        console.error('Fetch data error:', error);
      }
    };
    fetchData();
  }, [id]);

  // 추가 //
  const handleInquiry = () => {
    // 문의하기 버튼 클릭 시 실행되는 함수
    if (!currentUserId || !user?.id || !id) {
      // 사용자 ID, 작성자 ID 또는 게시물 ID가 없을 경우 에러 로그 출력
      console.error('No user logged in, author ID or post ID missing');
      alert("로그인 후 이용해주세요.")
      const presentPage = window.location.href;
      const pagePathname = new URL(presentPage).pathname;
      Cookies.set('returnPage', pagePathname);
      router.push('/login');
    }
    toggleChat(); // 채팅 창 열림/닫힘 상태를 토글
  };

  const handlePortfolioClick = (portfolio: PortfolioData) => {
    // 포트폴리오 카드 클릭 시 모달 열림
    setSelectedPortfolio(portfolio);
  };

  const handlePortfolioModalClose = () => {
    // 포트폴리오 모달 닫기
    setSelectedPortfolio(null);
  };

  // 여기까지 //

  if (!post || !user) {
    return <p>로딩중</p>;
  }

  const handleTabClick = (tabId: string, sectionId: string) => {
    setActiveTab(tabId);
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionRect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // 섹션 중앙을 뷰포트 중앙에 맞추도록 오프셋 계산
      const yOffset = (viewportHeight - sectionRect.height) / 2;
      const y = sectionRect.top + window.scrollY - yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto p-4">
      <div className="flex flex-row justify-between">
        <div className="h-[514px] w-[390px] border-2 rounded-xl flex flex-col">
          <div className="h-[150px] w-[150px] border-2 rounded-full mx-auto mt-5">
            <Image src={user.profile_img} alt="user_profile" className="object-cover h-full w-full rounded-full" width={150} height={150}  />
          </div>
          <div className="mx-auto text-2xl mt-4">
            <p>{user.nickname}</p>
          </div>
          <div className="mx-auto flex flex-col items-center justify-center font-thin mt-5">
            <div className="flex flex-row">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.5" cy="12" r="8" stroke="#687582" />
                <path d="M12.5 6V12L16.5 13.5" stroke="#687582" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>연락 가능 시간 : AM 9 - PM 6</p>
            </div>
            <div className="flex flex-row">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4.5 12C4.5 9.23858 6.73858 7 9.5 7H15.5C18.2614 7 20.5 9.23858 20.5 12V12C20.5 14.7614 18.2614 17 15.5 17H11.7376C10.4503 17 9.28296 17.7556 8.75584 18.93V18.93C8.62057 19.2314 8.25032 19.3439 7.97018 19.1689L7.32001 18.7625C5.56572 17.6661 4.5 15.7433 4.5 13.6745V12Z"
                  stroke="#687582"
                />
                <path
                  d="M10.5 12C10.5 12.5523 10.0523 13 9.5 13C8.94772 13 8.5 12.5523 8.5 12C8.5 11.4477 8.94772 11 9.5 11C10.0523 11 10.5 11.4477 10.5 12Z"
                  fill="#687582"
                />
                <path
                  d="M13.5 12C13.5 12.5523 13.0523 13 12.5 13C11.9477 13 11.5 12.5523 11.5 12C11.5 11.4477 11.9477 11 12.5 11C13.0523 11 13.5 11.4477 13.5 12Z"
                  fill="#687582"
                />
                <path
                  d="M16.5 12C16.5 12.5523 16.0523 13 15.5 13C14.9477 13 14.5 12.5523 14.5 12C14.5 11.4477 14.9477 11 15.5 11C16.0523 11 16.5 11.4477 16.5 12Z"
                  fill="#687582"
                />
              </svg>
              <p>평균 응답 시간 : 30분</p>
            </div>
          </div>
          <div className="mx-auto mt-5">
            <p className="w-[30ch] line-clamp-3">
              유저에 대한 한 줄 소개글이 들어감. 유저 테이블에 필요할듯 유저에 대한 한 줄 소개글이 들어감. 유저 테이블에
              필요할듯 유저에 대한 한 줄 소개글이 들어감. 유저 테이블에 필요할듯 유저에 대한 한 줄 소개글이 들어감. 유저
              테이블에 필요할듯
            </p>
          </div>
          <div className="mx-auto w-[85%] mt-5 flex flex-col">
            <button
              className="w-full h-full bg-primary-500 hover:bg-primary-600 py-2 rounded-xl flex flex-row justify-center items-center"
              onClick={handleInquiry}
            >
              {' '}
              {/* handleInquiry 함수가 문의하기 버튼 클릭 시 실행됨 */}
              <span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.9488 15.1464L15.3133 19.8976C15.9018 20.5383 16.9712 20.1738 17.046 19.3071L18.2924 4.86566C18.3632 4.04436 17.4658 3.49486 16.7665 3.93141L4.47075 11.6075C3.73276 12.0682 3.89438 13.1864 4.73262 13.4193L10.9488 15.1464ZM10.9488 15.1464L15.2052 8.19459"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-white">문의하기</span>
            </button>
            <button className="w-full h-full hover:bg-primary-50 border-primary-500 border py-2 rounded-xl mt-2 flex flex-row justify-center items-center">
              <span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 8.5C3.72386 8.5 3.5 8.72386 3.5 9C3.5 9.27614 3.72386 9.5 4 9.5L4 8.5ZM20.3536 9.35355C20.5488 9.15829 20.5488 8.84171 20.3536 8.64645L17.1716 5.46447C16.9763 5.26921 16.6597 5.26921 16.4645 5.46447C16.2692 5.65973 16.2692 5.97631 16.4645 6.17157L19.2929 9L16.4645 11.8284C16.2692 12.0237 16.2692 12.3403 16.4645 12.5355C16.6597 12.7308 16.9763 12.7308 17.1716 12.5355L20.3536 9.35355ZM4 9.5L20 9.5L20 8.5L4 8.5L4 9.5Z"
                    fill="#253CE5"
                  />
                  <path
                    d="M20 14.5C20.2761 14.5 20.5 14.7239 20.5 15C20.5 15.2761 20.2761 15.5 20 15.5L20 14.5ZM3.64645 15.3536C3.45119 15.1583 3.45119 14.8417 3.64645 14.6464L6.82843 11.4645C7.02369 11.2692 7.34027 11.2692 7.53553 11.4645C7.7308 11.6597 7.7308 11.9763 7.53553 12.1716L4.70711 15L7.53553 17.8284C7.7308 18.0237 7.7308 18.3403 7.53553 18.5355C7.34027 18.7308 7.02369 18.7308 6.82843 18.5355L3.64645 15.3536ZM20 15.5L4 15.5L4 14.5L20 14.5L20 15.5Z"
                    fill="#253CE5"
                  />
                </svg>
              </span>
              <span className="text-primary-500">구매하기</span>
            </button>
          </div>
        </div>
        <div className="h-[514px] w-[810px] border-2 rounded-xl">
          <Image src={post.post_img[0]} alt="post_image" className="w-full h-full object-cover rounded-xl" height={514} width={810} />
        </div>
      </div>
      <div className="mt-8">
        <div className="flex justify-start space-x-4 border-gray-300 p-4 sticky top-[71px] bg-white">
          <ul className="flex justify-start space-x-4">
            <li
              id="service"
              className={`text-lg ${
                activeTab === 'service' ? 'text-primary-500 border-b-2 border-primary-500 font-bold ' : 'text-gray-500'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick('service', 'section1');
              }}
            >
              <a href="#section1">서비스 정보</a>
            </li>
            <li
              id="portfolio"
              className={`text-lg ${
                activeTab === 'portfolio'
                  ? 'text-primary-500 border-b-2 border-primary-500 font-bold '
                  : 'text-gray-500'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick('portfolio', 'section2');
              }}
            >
              <a href="#section2">포트폴리오</a>
            </li>
            <li
              id="reviews"
              className={`text-lg ${
                activeTab === 'reviews' ? 'text-primary-500 border-b-2 border-primary-500 font-bold ' : 'text-gray-500'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick('reviews', 'section3');
              }}
            >
              <a href="#section3">리뷰</a>
            </li>
          </ul>
        </div>
        <div>
          <div id="section1" className="p-2 my-2">
            <h1 className="text-2xl my-3">서비스 정보</h1>
            <div data-color-mode="light">
              <MDEditor.Markdown source={post.content} />
            </div>
          </div>

          <div id="section2" className="p-2 my-4">
            <h1 className="text-2xl my-3">포트폴리오</h1>
            <div className="mt-4 flex flex-row justify-start flex-wrap">
              {portfolio.length === 0 ? (
                <div>
                  <p>아직 등록된 포트폴리오가 없습니다</p>
                </div>
              ) : (
                portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col border-2 p-4 rounded-xl w-[280px] mx-3 my-2 cursor-pointer"
                    onClick={() => handlePortfolioClick(item)} // 포트폴리오 카드 클릭 시 모달 열림
                  >
                    <div className="w-[3/4] h-[140px]">
                      <img
                        src={item.portfolio_img}
                        alt={item.title}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex flex-row justify-start items-center mt-3 text-xs">
                      <p>{item.lang_category}</p>
                    </div>
                    <div className="my-2">
                      <p className="font-bold text-lg line-clamp-1">{item.title}</p>
                    </div>
                    <div className="text-xs">
                      <p>
                        {item.start_date} ~ {item.end_date}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div id="section3" className="p-2 my-4">
            <h1 className="text-2xl">리뷰</h1>
            <div className="mt-4 flex flex-col justify-center items-center">
              <div className="mx-3 border border-slate-400 w-full p-4 rounded-xl mb-3">
                <div>
                  <p>⭐️⭐️⭐️⭐️⭐️</p>
                </div>
                <div className="line-clamp-1 my-2">
                  <p className="text-xl font-medium">리뷰 내용 입니다 !</p>
                </div>
                <div className="flex flex-row text-sm font-thin">
                  <div>
                    <p>작성자 : 코듀</p>
                  </div>
                  <div className="mx-2">
                    <p>작성일 : 2024.08.01</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 채팅모달 */}
      {chatRoomId && isChatOpen && <ChatModal chatRoomId={chatRoomId} onClose={toggleChat} />}

      {/* 포트폴리오 모달 */}
      {selectedPortfolio && (
        <PortfolioModal portfolio={selectedPortfolio} onClose={handlePortfolioModalClose} user={user} />
      )}
    </div>
  );
}
