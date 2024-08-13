import React, { useState } from 'react';
import { useChatNotifications } from '@/hooks/useChatNotifications'; // 커스텀 훅 임포트
import Image from 'next/image';

interface ChatNotificationProps {
  userId: string;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({ userId }) => {
  const { unreadCount, chatMessages, markMessagesAsRead, loading } = useChatNotifications(userId);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (!loading) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        markMessagesAsRead();
      }
    }
  };

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
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-medium">메시지 알림</h3>
            {chatMessages.length > 0 ? (
              <ul>
                {chatMessages.map((message) => (
                  <li key={message.id} className="border-b py-2">
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">새로운 메시지가 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNotification;
