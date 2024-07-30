'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChatMessage } from '@/types/type';

const supabase = createClient();

type ChatModalProps = {
  chatRoomId: string;
  onClose: () => void;
};

const ChatModal: React.FC<ChatModalProps> = ({ chatRoomId, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUser(data.session?.user || null);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('Chat')
        .select('*')
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data as ChatMessage[]);
      }
    };

    fetchMessages();

    const chatChannel = supabase
      .channel('realtime:chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat', filter: `chat_room_id=eq.${chatRoomId}` }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [chatRoomId]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newMessage.trim() === '') return;
    if (!currentUser) return;

    const { error } = await supabase.from('Chat').insert([
      {
        consumer_id: currentUser.id,
        pro_id: currentUser.id, // 이 부분은 실제 사용 시 변경 필요
        content: newMessage,
        chat_room_id: chatRoomId,
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md w-1/2">
        <button onClick={onClose} className="text-black float-right">닫기</button>
        <h1 className="text-2xl font-bold mb-4">채팅방</h1>
        <div className="h-64 overflow-y-scroll border border-gray-300 p-4 rounded-md">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 flex ${message.consumer_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-2 rounded-md ${message.consumer_id === currentUser?.id ? 'bg-gray-500 text-white' : 'bg-gray-300 text-black'}`}>
                <strong>{message.consumer_id === currentUser?.id ? '나 ' : message.consumer_id}:</strong> {message.content}
                <span className="block text-sm text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
            placeholder="문의사항을 입력하세요"
          />
          <button type="submit" className="p-2 bg-gray-500 text-white rounded-md">
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
