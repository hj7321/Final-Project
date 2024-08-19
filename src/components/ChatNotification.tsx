import React, { useState, useEffect, useRef } from 'react';
import { useChatNotifications } from '@/hooks/useChatNotifications';
import Image from 'next/image';
import ChatModal from '@/app/(provider)/(root)/chat/_components/ChatModal';

interface ChatNotificationProps {
  userId: string;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({ userId }) => {
  const { unreadCount, chatRooms, markMessagesAsRead, loading, fetchChatNotifications } = useChatNotifications(userId);
  const [isOpen, setIsOpen] = useState(false);
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatNotifications();
  }, [fetchChatNotifications]);

  const toggleDropdown = () => {
    if (!loading) {
      setIsOpen(!isOpen);
    }
  };

  const openChatModal = (chatRoomId: string) => {
    setCurrentChatRoomId(chatRoomId);
    setIsOpen(false);
  };

  const closeChatModal = async () => {
    setCurrentChatRoomId(null);
    await fetchChatNotifications();
  };

  // 읽지 않은 채팅방만 필터링
  const unreadChatRooms = chatRooms.filter(room => room.unread_count > 0);

  // 드롭다운 외부 클릭 시 닫히게 설정
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative">
        <Image src="/alarm_comment.svg" alt="채팅 알림 아이콘" width={24} height={24}/>
        {unreadCount > 0 && (
          <span className="absolute top-0 bottom-4 right-0 left-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:mt-2 md:w-80 md:bg-white md:shadow-lg md:rounded-lg md:border md:border-grey-100 top-25 left-0 w-[252px] md:min-w-[320px] h-full md:h-auto bg-white z-50"
        >
          <div className="relative md:static">
            {/* 말풍선 꼬리 */}
            <div className="hidden md:block absolute top-[-10px] left-[50%] transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-grey-200 relative">
                <div className="absolute top-[1px] left-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto h-full md:h-auto">
            {unreadChatRooms.length > 0 ? (
              <div className="px-4 py-3">
                <ul>
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
                </ul>
              </div>
            ) : (
              <div className="p-4">
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
