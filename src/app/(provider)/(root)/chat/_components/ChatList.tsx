'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChatMessage } from '@/types/type';
import ChatModal from './ChatModal';
import { CodeCategories } from '@/components/dumy';

const supabase = createClient();

interface ChatRoomInfo {
  chat_room_id: string;
  post_lang_category: string[];
  post_title: string;
  user_nickname: string;
  user_profile_img: string;
  latest_message: string;
  latest_message_time: string;
  unread_count: number;
}

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([]);
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

  const fetchChatRooms = async () => {
    if (!currentUserId) return;

    const { data: chatData, error: chatError } = await supabase
      .from('Chat')
      .select('chat_room_id, post_id, consumer_id, pro_id, content, created_at')
      .or(`consumer_id.eq.${currentUserId},pro_id.eq.${currentUserId}`);

    if (chatError) {
      console.error('Error fetching chat rooms:', chatError.message);
      return;
    }

    if (chatData && chatData.length > 0) {
      const chatRoomInfoPromises = chatData.map(async (chatRoom) => {
        if (!chatRoom.post_id) {
          return null;
        }

        const { data: postData, error: postError } = await supabase
          .from('Request Posts')
          .select('title, lang_category')
          .eq('id', chatRoom.post_id)
          .single();

        const otherUserId = chatRoom.consumer_id === currentUserId ? chatRoom.pro_id : chatRoom.consumer_id;
        
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('nickname, profile_img')
          .eq('id', otherUserId)
          .single();

        const { data: latestMessageData, error: latestMessageError } = await supabase
          .from('Chat')
          .select('content, created_at')
          .eq('chat_room_id', chatRoom.chat_room_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const { count: unreadCount, error: unreadCountError } = await supabase
          .from('Chat')
          .select('*', { count: 'exact' })
          .eq('chat_room_id', chatRoom.chat_room_id)
          .eq('is_read', false)
          .neq('consumer_id', currentUserId);

        if (postError) {
          console.error('Error fetching post data:', postError.message);
          return null;
        }

        if (userError) {
          console.error('Error fetching user data:', userError.message);
          return null;
        }

        if (latestMessageError) {
          console.error('Error fetching latest message:', latestMessageError.message);
          return null;
        }

        if (unreadCountError) {
          console.error('Error fetching unread count:', unreadCountError.message);
          return null;
        }

        return {
          chat_room_id: chatRoom.chat_room_id,
          post_lang_category: postData?.lang_category || [],
          post_title: postData?.title || '제목 없음',
          user_nickname: userData?.nickname || '알 수 없음',
          user_profile_img: userData?.profile_img || '',
          latest_message: latestMessageData?.content || '메시지가 없습니다.',
          latest_message_time: latestMessageData?.created_at || '',
          unread_count: unreadCount || 0,
        } as ChatRoomInfo;
      });

      const resolvedChatRooms = (await Promise.all(chatRoomInfoPromises)).filter(Boolean) as ChatRoomInfo[];
      resolvedChatRooms.sort((a, b) => new Date(b.latest_message_time).getTime() - new Date(a.latest_message_time).getTime());
      setChatRooms(resolvedChatRooms);
    }
  };

  useEffect(() => {
    fetchChatRooms();

    const chatChannel = supabase
      .channel('realtime:chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat' }, () => {
        fetchChatRooms(); // 새 메시지가 추가될 때마다 채팅방 목록을 다시 가져옵니다.
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [currentUserId]);

  const getCategoryImage = (category: string) => {
    const categoryData = CodeCategories.find(cat => cat.name === category);
    return categoryData ? categoryData.image : 'https://via.placeholder.com/150?text=No+Image';
  };

  const truncateMessage = (message: string, maxLength: number) => {
    if (message.length > maxLength) {
      return message.slice(0, maxLength) + '...';
    }
    return message;
  };

  const openChatModal = (chatRoomId: string) => {
    setCurrentChatRoomId(chatRoomId);
  };

  const closeChatModal = () => {
    setCurrentChatRoomId(null);
    fetchChatRooms(); // 모달을 닫을 때 채팅방 목록을 다시 가져옵니다.
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">나의 문의내역</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chatRooms.map((room) => (
          <div
            key={room.chat_room_id}
            className="py-8 px-4 border border-gray-300 rounded-3xl cursor-pointer"
            onClick={() => openChatModal(room.chat_room_id)}
          >
            <div className="flex items-center justify-center mb-4">
              <div className='flex items-center'>
                <img src={getCategoryImage(room.post_lang_category[0])} alt={room.post_lang_category[0]} className="w-10 h-10 mr-2" />
                <h2 className="text-md">{room.post_lang_category[0]}</h2>
              </div>
              <h3 className="text-lg font-bold items-center ml-4">{room.post_title}</h3>
            </div>
            <div className="flex items-center justify-center mt-4 mb-4">
              <img src={room.user_profile_img} alt="상대 프로필" className="w-24 h-24 border border-gray-300 rounded-full" />
            </div>
            <div className="text-center">
              <div className='flex items-center justify-center'>
                <p className="text-xl font-bold item-center">{room.user_nickname}</p>
                <p>님</p>
                {room.unread_count > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">{room.unread_count}</span>
                )}
              </div>
              <p className="text-gray-600 px-12 mt-1">{truncateMessage(room.latest_message, 36)}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(room.latest_message_time).toLocaleDateString()}</p>
            </div>
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
