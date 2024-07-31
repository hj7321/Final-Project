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
  const [otherUser, setOtherUser] = useState<{ nickname: string, profile_img: string } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUser(data.session?.user || null);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!currentUser) return;

      const { error } = await supabase
        .from('Chat')
        .update({ is_read: true })
        .eq('chat_room_id', chatRoomId)
        .neq('consumer_id', currentUser.id);

      if (error) {
        console.error('Error marking messages as read:', error.message);
      }
    };

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
        markMessagesAsRead(); // 메시지를 읽었을 때 바로 읽음 처리
      }
    };

    const fetchOtherUser = async () => {
      if (!currentUser) return;

      const { data: chatData, error: chatError } = await supabase
        .from('Chat')
        .select('consumer_id, pro_id')
        .eq('chat_room_id', chatRoomId);

      if (chatError) {
        console.error('Error fetching chat data:', chatError);
        return;
      }

      if (chatData.length === 0) {
        console.error('No chat data found');
        return;
      }

      const otherUserId = chatData[0].consumer_id === currentUser.id ? chatData[0].pro_id : chatData[0].consumer_id;

      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('nickname, profile_img')
        .eq('id', otherUserId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
      } else {
        setOtherUser(userData);
      }
    };

    fetchMessages();
    fetchOtherUser();

    const chatChannel = supabase
      .channel('realtime:chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat', filter: `chat_room_id=eq.${chatRoomId}` }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [chatRoomId, currentUser]);

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
        is_read: false, // 새로운 메시지는 읽지 않음으로 표시
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
      <div className="bg-white p-5 rounded-xl w-1/3 max-w-xl h-5/6">
        <button onClick={onClose} className="text-black float-right">닫기</button>
        <div className="flex items-center mb-6">
          {otherUser && (
            <>
              <img src={otherUser.profile_img} alt="상대 프로필" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h2 className="text-xl font-bold">{otherUser.nickname}</h2>
                <p className="text-sm text-gray-600">연락 가능 시간: AM 9 - PM 6</p>
                <p className="text-sm text-gray-600">평균 응답 속도: 30분 이내</p>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col h-5/6 justify-between border border-gray-300 rounded-xl bg-gray-100 overflow-hidden">
          <div className="overflow-y-scroll mb-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 flex ${message.consumer_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-3 rounded-lg text-xs max-w-xs ${message.consumer_id === currentUser?.id ? 'bg-primary-50 border border-primary-200 text-black' : 'bg-gray-50 border border-grey-200 text-black'} break-words`}>
                  <strong>{message.consumer_id === currentUser?.id ? '나 ' : otherUser?.nickname}:</strong> {message.content}
                  {/* <span className="block text-[10px] text-gray-500 mt-1">{new Date(message.created_at).toLocaleString()}</span> */}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center p-4 bg-white rounded-b-xl">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
              placeholder="메시지를 입력하세요"
            />
            <button type="submit" className="p-2 bg-primary-500 text-white rounded-lg">
              보내기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
