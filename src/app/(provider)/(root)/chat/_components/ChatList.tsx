'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import ChatModal from './ChatModal';
import { CodeCategories } from '@/components/dumy';
import Image from 'next/image';

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

  const fetchChatRooms = useCallback(async () => {
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
          unread_count: unreadCount || 0
        } as ChatRoomInfo;
      });

      const resolvedChatRooms = (await Promise.all(chatRoomInfoPromises)).filter(Boolean) as ChatRoomInfo[];
      resolvedChatRooms.sort(
        (a, b) => new Date(b.latest_message_time).getTime() - new Date(a.latest_message_time).getTime()
      );
      setChatRooms(resolvedChatRooms);
    }
  }, [currentUserId, setChatRooms]);

  useEffect(() => {
    fetchChatRooms();

    const chatChannel = supabase
      .channel('realtime:chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat' }, () => {
        fetchChatRooms(); // 새 메시지가 추가될 때마다 채팅방 목록을 다시 가져옴.
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [currentUserId, fetchChatRooms]);

  const getCategoryImage = (category: string) => {
    const categoryData = CodeCategories.find((cat) => cat.name === category);
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

  const markMessagesAsRead = (chatRoomId: string) => {
    // 특정 채팅방의 메시지를 읽음 처리
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((room) => (room.chat_room_id === chatRoomId ? { ...room, unread_count: 0 } : room))
    );
  };

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
        <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24 mx-auto mb-4" />
        <div className="text-lg font-semibold mb-2">아직 거래내역이 없어요</div>
        <div className="text-sm text-gray-600 mb-4">전문가 의뢰를 통해 원하는 결과물을 받아보세요 </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-0 md:p-2">
      <h1 className="text-xl font-semibold mb-4 hidden md:block">나의 문의내역</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-2">
        {chatRooms.map((room) => (
          <div
            key={room.chat_room_id}
            className="flex flex-col justify-between w-auto md:max-w-52 h-48 md:h-64 p-2 md:py-5 md:px-6 border border-gray-200 rounded-xl cursor-pointer transition-transform transform hover:scale-105 duration-300 hover:shadow-md hover:shadow-primary-100"
            onClick={() => openChatModal(room.chat_room_id)}
          >
            <div>
              <div className="flex items-center justify-center mt-2 mb-2">
                <div className="flex items-center">
                  <Image
                    src={getCategoryImage(room.post_lang_category[0])}
                    alt={room.post_lang_category[0]}
                    width={10}
                    height={10}
                    className="w-6 h-6 hidden md:block"
                  />
                  <div className="text-xs font-normal ml-1 truncate hidden md:block">{room.post_lang_category[0]}</div>
                </div>
                <h3 className="text-xs font-bold items-center max-w-20 ml-2 truncate">{room.post_title}</h3>
              </div>
              <div className="flex items-center justify-center mt-2 mb-2">
                <Image
                  src={room.user_profile_img || '/defaultProfileimg.svg'}
                  alt="상대 프로필"
                  width={20}
                  height={20}
                  className="w-12 h-12 mt-3 border border-gray-300 rounded-full"
                />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mt-4">
                  <p className="text-sm font-semibold item-center">{room.user_nickname}</p>
                  <p className="text-sm font-normal ml-1">님</p>
                  {room.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                      {room.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 font-normal text-xs mt-1 truncate overflow-hidden">
                  {truncateMessage(room.latest_message, 40)}
                </p>
              </div>
            </div>
            <p className="text-xs font-normal text-gray-400 md:mt-2 self-center">
              {new Date(room.latest_message_time).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {currentChatRoomId && (
        <ChatModal
          chatRoomId={currentChatRoomId}
          onClose={closeChatModal}
          onMessagesRead={() => markMessagesAsRead(currentChatRoomId!)} // 읽음 처리 콜백
        />
      )}
    </div>
  );
};

export default ChatList;
