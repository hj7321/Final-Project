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

    const { data, error } = await supabase
      .from('Chat')
      .select('chat_room_id, post_id, consumer_id, pro_id, content, created_at, is_read')
      .or(`consumer_id.eq.${userId},pro_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat notifications:', error.message);
      setLoading(false);
      return;
    }

    const chatRoomsData: ChatRoomInfo[] = [];

    for (let chat of data) {
      if (chat.consumer_id === userId) {
        continue; // 현재 사용자가 보낸 메시지는 제외
      }

      const otherUserId = chat.consumer_id === userId ? chat.pro_id : chat.consumer_id;

      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('nickname, profile_img')
        .eq('id', otherUserId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError.message);
        continue;
      }

      const { count: unreadCount } = await supabase
        .from('Chat')
        .select('id', { count: 'exact' })
        .eq('chat_room_id', chat.chat_room_id)
        .eq('is_read', false)
        .neq('consumer_id', userId);

      chatRoomsData.push({
        chat_room_id: chat.chat_room_id,
        user_nickname: userData?.nickname || '알 수 없음',
        user_profile_img: userData?.profile_img || '',
        latest_message: chat.content,
        latest_message_time: chat.created_at || '',
        unread_count: unreadCount || 0,
        post_lang_category: [],  // 기본값으로 빈 배열 제공
        post_title: '제목 없음', // 기본값으로 '제목 없음' 제공
      });
    }

    setChatRooms(chatRoomsData);
    setUnreadCount(chatRoomsData.reduce((sum, room) => sum + room.unread_count, 0));
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
