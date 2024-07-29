import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { uuid } from 'uuidv4';

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
        .or(`consumer_id.eq.${currentUserId},pro_id.eq.${currentUserId}`)
        .or(`consumer_id.eq.${authorId},pro_id.eq.${authorId}`)
        .eq('post_id', postId)
        .single();

      if (error && error.code !== 'PGRST116') {
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
              chat_room_id: uuid(),  // Remove content field here
              post_id: postId,
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
