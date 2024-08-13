import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Chat } from '@/types/type';  // Chat 타입이 정의되어 있어야 합니다.

const supabase = createClient();

export const useChatNotifications = (userId: string) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<Chat[]>([]);  // Chat 타입을 지정
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadMessages = async () => {
      const { data, error }: PostgrestResponse<Chat> = await supabase
        .from('Chat')
        .select('*')
        .eq('pro_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread messages:', error.message);
        setLoading(false);
        return;
      }

      setChatMessages(data || []);
      setUnreadCount(data.length || 0);
      setLoading(false);
    };

    fetchUnreadMessages();

    // 실시간 메시지 알림을 설정
    const chatChannel = supabase
      .channel('realtime:chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Chat' }, (payload) => {
        const newMessage = payload.new as Chat;  // payload.new의 타입을 Chat으로 캐스팅

        if (newMessage.pro_id === userId && !newMessage.is_read) {
          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
          setUnreadCount((prevCount) => prevCount + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [userId]);

  const markMessagesAsRead = async () => {
    const { error } = await supabase
      .from('Chat')
      .update({ is_read: true })
      .eq('pro_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking messages as read:', error.message);
      return;
    }

    setUnreadCount(0);
  };

  return { unreadCount, chatMessages, markMessagesAsRead, loading };
};
