import React, { useState } from 'react';
import { useChatNotifications } from '@/hooks/useChatNotifications'; // 커스텀 훅 임포트
import Image from 'next/image';
import ChatModal from '@/app/(provider)/(root)/chat/_components/ChatModal';

interface ChatNotificationProps {
  userId: string;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({ userId }) => {
  const { unreadCount, chatRooms, markMessagesAsRead, loading, fetchChatNotifications } = useChatNotifications(userId); // fetchChatNotifications 추가
  const [isOpen, setIsOpen] = useState(false);
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(null);

  const toggleDropdown = () => {
    if (!loading) {
      setIsOpen(!isOpen);
    }
  };

  const openChatModal = (chatRoomId: string) => {
    setCurrentChatRoomId(chatRoomId);
    setIsOpen(false); // 드롭다운 닫기
  };

  const closeChatModal = async () => {
    setCurrentChatRoomId(null);
    await fetchChatNotifications(); // 모달을 닫을 때 알림 상태를 업데이트
  };

  // 읽지 않은 채팅방만 필터링
  const unreadChatRooms = chatRooms.filter(room => room.unread_count > 0);

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative">
        <Image src="/alarm_chat.svg" alt="채팅 알림 아이콘" width={24} height={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 border border-grey-100">
          <div>
            {unreadChatRooms.length > 0 ? (
              <div className='px-4 py-3'>
                {unreadChatRooms.map((room) => (
                  <li key={room.chat_room_id} className="border-b py-2 flex items-center" onClick={() => openChatModal(room.chat_room_id)}>
                    <Image
                      src={room.user_profile_img || '/defaultProfileimg.svg'}
                      alt="상대 프로필"
                      width={40}
                      height={40}
                      className="rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-grey-400">{room.user_nickname}</p>
                      <div className="flex items-center">
                        <p className="text-sm truncate">{room.latest_message}</p>
                        {room.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center ml-1">
                            {room.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            ) : (
              <div className='p-4'>
                <p className="text-sm text-gray-500">새로운 메시지가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentChatRoomId && (
        <ChatModal
          chatRoomId={currentChatRoomId}
          onClose={closeChatModal}
          onMessagesRead={() => markMessagesAsRead(currentChatRoomId!)}
        />
      )}
    </div>
  );
};

export default ChatNotification;
