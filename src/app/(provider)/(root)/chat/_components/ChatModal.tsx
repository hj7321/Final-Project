import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Chat, Users } from '@/types/type';
import Image from 'next/image';

const supabase = createClient();

type ChatModalProps = {
  chatRoomId: string;
  onClose: () => void;
  onMessagesRead: () => void;
};

const ChatModal: React.FC<ChatModalProps> = ({ chatRoomId, onClose, onMessagesRead }) => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [otherUser, setOtherUser] = useState<Users | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        setMessages(data as Chat[]);
        onMessagesRead(); // 메시지를 읽었을 때 콜백 호출
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
        setOtherUser(userData as Users);
      }
    };

    fetchMessages();
    fetchOtherUser();

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatRoomId, currentUser, onMessagesRead]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newMessage.trim() === '') return;
    if (!currentUser) return;

    const { error } = await supabase.from('Chat').insert([
      {
        consumer_id: currentUser.id,
        pro_id: currentUser.id,
        content: newMessage,
        chat_room_id: chatRoomId,
        is_read: false,
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-0 md:p-0">
      <div className="bg-white md:p-5 md:rounded-xl w-full md:w-1/3 max-w-xl h-full md:h-5/6">
        <button onClick={onClose} className="text-black float-right mr-2 md:mr-0">
          <Image src="/closeBtnX.svg" alt="닫기버튼" width={20} height={20} />
        </button>
        <div className="flex items-center mb-6 ml-1 md:ml-0">
          {otherUser && (
            <>
              <img src={otherUser.profile_img || '/defaultProfileimg.svg'} alt="상대 프로필" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h2 className="text-sm font-semibold">{otherUser.nickname}</h2>
                <p className="text-sm font-medium text-gray-500">연락 가능 시간: AM 9 - PM 6</p>
                <p className="text-sm font-medium text-gray-500">평균 응답 속도: 30분 이내</p>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col h-5/6 w-full md:w-auto justify-between md:border border-gray-300 md:rounded-xl bg-gray-100 overflow-hidden">
          <div className="overflow-y-scroll mb-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 flex ${message.consumer_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-3 rounded-lg text-xs max-w-xs font-medium ${message.consumer_id === currentUser?.id ? 'bg-primary-50 border border-primary-100 text-black' : 'bg-gray-50 border border-grey-200 text-black'} break-words`}>
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center p-4 bg-white rounded-b-xl">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg mr-2 text-sm font-normal py-3"
              placeholder="메시지를 입력하세요"
            />
            <button type="submit" className="p-2 bg-primary-500 text-white text-sm font-normal rounded-lg flex p-3">
              <Image src="/sendMessage.svg" alt="메세지버튼" width={20} height={20} className='text-white'/>
              <div className='hidden md:block'>보내기</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
