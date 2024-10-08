'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession'; // 사용자 세션 커스텀 훅을
import { useChatRoom } from '@/hooks/useChatRoom'; // 채팅 방 관리 커스텀 훅
import ChatModal from '../../../chat/_components/ChatModal'; // 채팅모달컴포넌트
import PortfolioModal from './_components/PortfolioModal';
import Cookies from 'js-cookie';
import ProDetailSkeleton from './_components/ProDetailSkeleton';
import DetailAccount from './_components/AccountDetail';
import useProMain from '@/hooks/useProMain';
import PostDescription from './_components/PostDescription';
import UserPortfolio from './_components/UserPortfolio';
import Reviews from './_components/Reviews';
import TabBar from './_components/TabBar';
import PostImage from './_components/PostImage';
import PurChaseBtn from './_components/PurchaseBtn';
import InquireBtn from './_components/InquireBtn';
import ServiceDeskTopView from './_components/ServiceDeskTopView';
import ServiceMobileView from './_components/ServiceMobileView';
import UserDescription from './_components/UserDescription';
import UserProfile from './_components/UserProfile';
import PageBackBtn from './_components/PageBackBtn';

export interface PostData {
  post_img: string[];
  content: string;
  title: string;
  lang_category: string[];
  price: number;
  id: string;
  user_id: string;
}

interface UserData {
  id: string;
  nickname: string;
  profile_img: string;
  possible_time: string;
  introduction: string;
}

export interface PortfolioData {
  id: string;
  user_id: string;
  title: string;
  content: string;
  portfolio_img: string;
  lang_category: string[];
  start_date: string;
  end_date: string;
}

interface ReviewData {
  id: string;
  created_at: string;
  stars: number;
  contents: string;
  request_post_id: string;
  user: {
    nickname: string;
  };
}

export default function ProDetail() {
  const [post, setPost] = useState<PostData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [activeTab, setActiveTab] = useState('service');
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioData | null>(null); // 선택된 포트폴리오
  const [isDetailAccountOpen, setIsDetailAccountOpen] = useState(false); // 추가: DetailAccount 모달 열림 상태 관리

  const { id: paramId } = useParams();
  const id = paramId as string;
  const router = useRouter();
  const { currentUserId } = useSession();
  const { chatRoomId, isChatOpen, toggleChat, createOrFetchChatRoom } = useChatRoom(
    currentUserId,
    user?.id || null,
    id
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/proDetail?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPost(data.postData);
        setUser(data.userData);
        setPortfolio(data.portfolioData);
        setReviews(data.reviewData);
      } catch (error) {
        console.error('Fetch data error:', error);
      }
    };
    fetchData();
  }, [id]);


  const handleInquiry = async () => {
    if (!currentUserId || !user?.id || !id) {
      console.error('No user logged in, author ID or post ID missing');
      alert('로그인 후 이용해주세요.');
      const presentPage = window.location.href;
      const pagePathname = new URL(presentPage).pathname;
      Cookies.set('returnPage', pagePathname);
      router.push('/login');
      return;
    }

    await createOrFetchChatRoom(); // 채팅방 생성 또는 기존 채팅방 가져오기
    toggleChat(); // 채팅 창 열기/닫기
  };

  const handlePortfolioClick = (portfolio: PortfolioData) => {
    setSelectedPortfolio(portfolio);
  };

  const handlePortfolioModalClose = () => {
    setSelectedPortfolio(null);
  };


  const handleAccount = () => {
    setIsDetailAccountOpen(true); // DetailAccount 모달 열기
  };

  const handleCloseDetailAccount = () => {
    setIsDetailAccountOpen(false); // DetailAccount 모달 닫기
  };

  if (!post || !user) {
    return <ProDetailSkeleton />;
  }

  const handleTabClick = (tabId: string, sectionId: string) => {
    setActiveTab(tabId);
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionRect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const yOffset = (viewportHeight - sectionRect.height) / 2;
      const y = sectionRect.top + window.scrollY - yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  return (
    <div className="max-w-[1280px] mx-auto md:p-4 pl-4 pr-4 pb-4">
      <div className="flex md:flex-row flex-col-reverse justify-between items-center mt-[20px] md:mt-[40px]">
        <div className="md:h-[470px] md:w-[380px] w-[330px] h-[80px] md:border-2 rounded-xl flex flex-col items-center">
          <div className="flex-col flex md:flex-col">
            <UserProfile profile={user.profile_img} nickname={user.nickname} possibleTime={user.possible_time} />
            <UserDescription introduction={user.introduction} />
            <ServiceMobileView title={post.title} langCategory={post.lang_category} price={post.price} />
            <div className="mx-auto w-full md:mt-5 my-2 flex flex-row justify-evenly items-center mt-[15px]">
              <InquireBtn handleInquiry={handleInquiry} />
              <PurChaseBtn handleAccount={handleAccount} />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:h-[470px]">
          <PostImage postImage={post.post_img} />
          <ServiceDeskTopView title={post.title} langCategory={post.lang_category} price={post.price} />
        </div>
      </div>
      <div className="md:mt-8 md:mt-[60px] mt-[240px]">
        <TabBar
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          portfolioCount={portfolio.length}
          reviewCount={reviews.length}
        />
        <div>
          <PostDescription content={post.content} />
          <UserPortfolio portfolio={portfolio} handlePortfolioClick={handlePortfolioClick} />
          <Reviews reviews={reviews} />
        </div>
      </div>
      {/* 채팅모달 */}
      {chatRoomId && isChatOpen && <ChatModal chatRoomId={chatRoomId} onClose={toggleChat} onMessagesRead={() => {}} />}

      {/* 포트폴리오 모달 */}
      {selectedPortfolio && (
        <PortfolioModal portfolio={selectedPortfolio} onClose={handlePortfolioModalClose} user={user} />
      )}
      {/* DetailAccount 모달 */}
      {isDetailAccountOpen && (
        <DetailAccount onClose={handleCloseDetailAccount} post={post} user={user} portfolio={portfolio} />
      )}
    </div>
  );
}
