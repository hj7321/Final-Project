'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession'; // 사용자 세션 커스텀 훅을
import { useChatRoom } from '@/hooks/useChatRoom'; // 채팅 방 관리 커스텀 훅
import ChatModal from '../../../chat/_components/ChatModal'; // 채팅모달컴포넌트
import PortfolioModal from './_components/PortfolioModal';
import Cookies from 'js-cookie';
import ProDetailSkeleton from './_components/ProDetailSkeleton';
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
import useProfile from '@/hooks/useProfile';
import PortOne from '@portone/browser-sdk/v2';
import { Notify } from 'notiflix';

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

export default function ProDetail() {
  const [post, setPost] = useState<PostData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);
  const [activeTab, setActiveTab] = useState('service');
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioData | null>(null); // 선택된 포트폴리오

  const { id: paramId } = useParams();
  const id = paramId as string;
  const router = useRouter();
  const { currentUserId } = useSession();
  const { userData } = useProfile(currentUserId);
  const { chatRoomId, isChatOpen, toggleChat, createOrFetchChatRoom } = useChatRoom(
    currentUserId,
    user?.id || null,
    id
  );
  const { getCategoryImage } = useProMain();
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
      } catch (error) {
        console.error('Fetch data error:', error);
      }
    };
    fetchData();
  }, [id]);

  // 추가(수정-승현) //
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

  // 여기까지 //

  // 추가(수정-동규) //

  const handleAccount = async () => {
    if (!post || !userData) {
      console.error('Post data or user data is not available');
      return;
    }

    const paymentId = `payment-${crypto.randomUUID().slice(0, 20)}`;

    try {
      await PortOne.requestPayment({
        storeId: 'store-ffd570b5-f558-4f58-abc1-12d5db5a33e0',
        channelKey: 'channel-key-584a8128-bbef-438f-8d11-7d7ab2d8c1d9',
        paymentId: paymentId,
        orderName: post.title,
        totalAmount: post.price,
        currency: 'CURRENCY_KRW',
        payMethod: 'CARD',
        customer: {
          fullName: userData.nickname,
          phoneNumber: '010-0000-1234',
          email: userData.email
        }
      });

      await fetch(`/api/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentId,
          orderId: post.id,
          buyerId: currentUserId,
          proId: post.user_id
        })
      });

      Notify.success('결제가 완료되었습니다.');
      router.push(`/CompletedAccount/${paymentId}`);
    } catch (error) {
      console.log(
        JSON.stringify({
          paymentId: paymentId,
          orderId: post.id
        })
      );
      console.error('Payment failed:', error);
      alert('결제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 여기까지 //

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

  console.log(post.post_img);
  return (
    <div className="max-w-[1280px] mx-auto md:p-4 pl-4 pr-4 pb-4">
      <PageBackBtn />
      <div className="flex md:flex-row flex-col-reverse justify-between items-center">
        <div className="md:h-[470px] md:w-[380px] w-[330px] h-[80px] md:border-2 rounded-xl flex flex-col items-center">
          <div className="flex-col flex md:flex-col">
            <UserProfile profile={user.profile_img} nickname={user.nickname} />
            <UserDescription />
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
        <TabBar activeTab={activeTab} handleTabClick={handleTabClick} portfolioCount={portfolio.length} />
        <div>
          <PostDescription content={post.content} />
          <UserPortfolio portfolio={portfolio} handlePortfolioClick={handlePortfolioClick} />
          <Reviews />
        </div>
      </div>
      {/* 채팅모달 */}
      {chatRoomId && isChatOpen && <ChatModal chatRoomId={chatRoomId} onClose={toggleChat} onMessagesRead={() => {}} />}
      {/* 포트폴리오 모달 */}
      {selectedPortfolio && (
        <PortfolioModal portfolio={selectedPortfolio} onClose={handlePortfolioModalClose} user={user} />
      )}
    </div>
  );
}
