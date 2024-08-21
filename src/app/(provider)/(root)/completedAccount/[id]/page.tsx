'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import ChatModal from '../../chat/_components/ChatModal';
import { useSession } from '@/hooks/useSession';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useChatRoom } from '@/hooks/useChatRoom';

interface UserData {
  id: string;
  nickname: string;
  profile_img: string;
}

interface PostData {
  id: string;
  post_img: string[];
  content: string;
  price: number;
  title: string;
  user_id: string;
}

export default function CompletedAccount() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUserId } = useSession();
  const router = useRouter();
  const { id: paymentId } = useParams(); 
  const searchParams = useSearchParams();
  const postId = searchParams.get('post_id');

  const [user, setUser] = useState(null);
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/account?id=${paymentId}`);
        const data = await response.json();
        const postData = data.find((item: PostData) => item.id === postId);

        if (postData) {
          setUser(postData.user_id);
          setPost(postData);
        } else {
          console.error('No matching post found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [paymentId]);

  const { chatRoomId, createOrFetchChatRoom, toggleChat } = useChatRoom(currentUserId, user || null, postId);

  const handleChatOpen = async () => {
    if (!currentUserId || !user || !post) {
      alert('필요한 정보가 부족합니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    await createOrFetchChatRoom();
    setIsChatOpen(true);

    toggleChat();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center h-[80vh] ">
      <Image src="/check_box.svg" alt="체크박스" width={80} height={80} className="mb-[32px]" />
      <h1 className="flex text-xl font-bold text-grey-900">결제가 완료되었어요!</h1>
      <h1 className="flex text-base  text-grey-600 mt-2 mb-[32px]">
        전문가 채팅에서 의뢰 내용과 채팅 시간을 상담해보세요!
      </h1>

      <button onClick={handleChatOpen} className="w-[376px] h-[56px] rounded-lg bg-primary-500 text-white">
        전문가 채팅으로 이동
      </button>

      {isChatOpen && chatRoomId && <ChatModal chatRoomId={chatRoomId} onClose={toggleChat} onMessagesRead={() => {}} />}
    </div>
  );
}
