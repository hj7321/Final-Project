'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChatMessage } from '@/types/type';
import ChatModal from './ChatModal';

const supabase = createClient();

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState<ChatMessage[]>([]);
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setCurrentUserId(data.session?.user.id || null);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!currentUserId) return;

      const { data, error } = await supabase
        .from('Chat')
        .select('chat_room_id, consumer_id, pro_id')
        .or(`consumer_id.eq.${currentUserId},pro_id.eq.${currentUserId}`);

      if (error) {
        console.error('Error fetching chat rooms:', error.message);
      } else {
        const uniqueChatRooms = (data as ChatMessage[]).reduce((acc: ChatMessage[], room: ChatMessage) => {
          if (!acc.some((item) => item.chat_room_id === room.chat_room_id)) {
            acc.push(room);
          }
          return acc;
        }, []);
        setChatRooms(uniqueChatRooms);
      }
    };

    fetchChatRooms();
  }, [currentUserId]);

  const openChatModal = (chatRoomId: string) => {
    setCurrentChatRoomId(chatRoomId);
  };

  const closeChatModal = () => {
    setCurrentChatRoomId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">내 채팅방</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chatRooms.map((room) => (
          <div
            key={room.chat_room_id}
            className="p-4 border border-gray-300 rounded-md cursor-pointer"
            onClick={() => openChatModal(room.chat_room_id)}
          >
            <h2 className="text-xl font-bold">채팅방 ID: {room.chat_room_id}</h2>
            <p>상대 ID: {room.consumer_id === currentUserId ? room.pro_id : room.consumer_id}</p>
          </div>
        ))}
      </div>
      {currentChatRoomId && (
        <ChatModal chatRoomId={currentChatRoomId} onClose={closeChatModal} />
      )}
    </div>
  );
};

export default ChatList;
