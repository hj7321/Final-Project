'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 라이브러리

const supabase = createClient();

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<Session | null>(null); // 현재 로그인된 사용자 세션
  const [proId, setProId] = useState<string>(''); // 메시지를 받을 사용자 ID
  const [chatRoomId, setChatRoomId] = useState<string>(uuidv4()); // 채팅방 ID

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUser(data.session);
    };

    fetchSession();

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('Chat')
        .select('*')
        .eq('chat_room_id', chatRoomId) // 특정 채팅방의 메시지 불러오기
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const chatChannel = supabase
      .channel('realtime:chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat', filter: `chat_room_id=eq.${chatRoomId}` }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [chatRoomId]); // chatRoomId가 변경될 때마다 실행

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newMessage.trim() === '') return;
    if (!currentUser) return;

    const { error } = await supabase.from('Chat').insert([
      {
        consumer_id: currentUser.user.id,
        pro_id: proId,
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">채팅테스트중</h1><h2> 이 페이지를 모달로할까말까 , 마이페이지에 컴포넌트로 문의리스트를 만들까 상의해보자 안까먹기</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">내 ID (로그인된 사용자 ID)</label>
        <input
          type="text"
          value={currentUser?.user.id || ''}
          readOnly
          className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">상대 ID (의뢰게시물 주인ID가될것)</label>
        <input
          type="text"
          value={proId}
          onChange={(e) => setProId(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">채팅방 ID (추후 폴더이동필요할듯)</label>
        <input
          type="text"
          value={chatRoomId}
          onChange={(e) => setChatRoomId(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <div className="h-64 overflow-y-scroll border border-gray-300 p-4 rounded-md">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 flex ${message.consumer_id === currentUser?.user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-2 rounded-md ${message.consumer_id === currentUser?.user.id ? 'bg-gray-500 text-white' : 'bg-gray-300 text-black'}`}>
                <strong>{message.consumer_id === currentUser?.user.id ? '나 ' : message.consumer_id}:</strong> {message.content}
                <span className="block text-sm text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="flex">
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
  );
};

export default Chat;
