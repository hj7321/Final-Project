import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient();

export const useChatRoom = (currentUserId: string | null, authorId: string | null, postId: string | null) => {
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchChatRoomId = async () => {
      if (!currentUserId || !authorId || !postId) return;

      const { data, error } = await supabase
        .from('Chat')
        .select('chat_room_id')
        .or(`and(consumer_id.eq.${currentUserId},pro_id.eq.${authorId},post_id.eq.${postId}),and(consumer_id.eq.${authorId},pro_id.eq.${currentUserId},post_id.eq.${postId})`)
        .single();

      if (error && error.code !== 'PGRST116') { // 'PGRST116' is the code for "No Rows Found"
        console.error('Error checking chat room:', error.message);
        return;
      }

      if (data) {
        setChatRoomId(data.chat_room_id);
      } else {
        const { data: newChatRoom, error: createError } = await supabase
          .from('Chat')
          .insert([
            {
              consumer_id: currentUserId,
              pro_id: authorId,
              chat_room_id: uuidv4(),
              post_id: postId,
              content: '문의를 시작합니다.', // Ensure the content is set to an empty string to satisfy the not-null constraint
            },
          ])
          .select('chat_room_id')
          .single();

        if (createError) {
          console.error('Error creating chat room:', createError.message);
          return;
        }

        setChatRoomId(newChatRoom.chat_room_id);
      }
    };

    fetchChatRoomId();
  }, [currentUserId, authorId, postId]);

  return { chatRoomId, isChatOpen, toggleChat, setChatRoomId };
};
