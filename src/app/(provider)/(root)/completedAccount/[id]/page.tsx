'use client';

import Image from 'next/image';
import { useState } from 'react';
import ChatModal from '../../chat/_components/ChatModal';

export default function CompletedAccount() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatOpen = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  const handleMessagesRead = () => {};

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

      {isChatOpen && (
        <ChatModal
          chatRoomId="db927b6c-9ba6-4235-8fcf-e9614ffd003b"
          onClose={handleChatClose}
          onMessagesRead={handleMessagesRead}
        />
      )}
    </div>
  );
}
