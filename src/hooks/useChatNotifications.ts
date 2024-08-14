import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChatRoomInfo } from '@/types/type';

const supabase = createClient();

export const useChatNotifications = (userId: string) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [chatRooms, setChatRooms] = useState<ChatRoomInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChatNotifications = async () => {
    if (!userId) return;

    // 채팅방 ID 목록을 가져오기
    const { data: chatRoomsData, error: chatRoomsError } = await supabase
      .from('Chat')
      .select('chat_room_id')
      .or(`consumer_id.eq.${userId},pro_id.eq.${userId}`);

    if (chatRoomsError) {
      console.error('Error fetching chat rooms:', chatRoomsError.message);
      setLoading(false);
      return;
    }

    // 중복된 채팅방 ID를 제거하기 위해 Set을 사용
    const uniqueChatRoomIds = Array.from(new Set(chatRoomsData.map((room) => room.chat_room_id)));

    const chatRoomPromises = uniqueChatRoomIds.map(async (chatRoomId) => {
      const { data: latestMessageData, error: latestMessageError } = await supabase
        .from('Chat')
        .select('content, created_at, consumer_id, pro_id')
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestMessageError) {
        console.error('Error fetching latest message:', latestMessageError.message);
        return null;
      }

      // 현재 사용자가 보낸 메시지인지 확인하기
      const isUserMessage = latestMessageData.consumer_id === userId;

      const otherUserId = isUserMessage ? latestMessageData.pro_id : latestMessageData.consumer_id;

      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('nickname, profile_img')
        .eq('id', otherUserId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError.message);
        return null;
      }

      const { count: unreadCount, error: unreadCountError } = await supabase
        .from('Chat')
        .select('id', { count: 'exact' })
        .eq('chat_room_id', chatRoomId)
        .eq('is_read', false)
        .neq('consumer_id', userId);

      if (unreadCountError) {
        console.error('Error fetching unread count:', unreadCountError.message);
        return null;
      }

      return {
        chat_room_id: chatRoomId,
        user_nickname: userData?.nickname || '알 수 없음',
        user_profile_img: userData?.profile_img || '',
        latest_message: latestMessageData.content,
        latest_message_time: latestMessageData.created_at || '',
        unread_count: unreadCount || 0,
        post_lang_category: [],  // 기본값으로 빈 배열 제공
        post_title: '제목 없음', // 기본값으로 '제목 없음' 제공
      } as ChatRoomInfo;
    });

    const resolvedChatRooms = (await Promise.all(chatRoomPromises)).filter(Boolean) as ChatRoomInfo[];
    resolvedChatRooms.sort((a, b) => {
      const timeA = a.latest_message_time ? new Date(a.latest_message_time).getTime() : 0;
      const timeB = b.latest_message_time ? new Date(b.latest_message_time).getTime() : 0;
      return timeB - timeA;
    });

    setChatRooms(resolvedChatRooms);
    setUnreadCount(resolvedChatRooms.reduce((sum, room) => sum + room.unread_count, 0));
    setLoading(false);
  };

  const markMessagesAsRead = async (chatRoomId: string) => {
    const updatedChatRooms = chatRooms.map((room) =>
      room.chat_room_id === chatRoomId ? { ...room, unread_count: 0 } : room
    );

    setChatRooms(updatedChatRooms);
    setUnreadCount(updatedChatRooms.reduce((sum, room) => sum + room.unread_count, 0));

    const { error } = await supabase
      .from('Chat')
      .update({ is_read: true })
      .eq('chat_room_id', chatRoomId)
      .neq('consumer_id', userId);

    if (error) {
      console.error('Error marking messages as read:', error.message);
    }
  };

  useEffect(() => {
    fetchChatNotifications();

    const chatChannel = supabase
      .channel('realtime:chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat' }, () => {
        fetchChatNotifications(); // 새 메시지가 추가될 때마다 알림 상태를 다시 가져옴.
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [userId]);

  return { unreadCount, chatRooms, loading, fetchChatNotifications, markMessagesAsRead };
};
