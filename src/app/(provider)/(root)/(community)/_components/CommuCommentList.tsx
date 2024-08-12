'use client';

import { CommunityComments } from '@/types/type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function CommuCommentList() {
  const { id: paramsId } = useParams();
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const getComments = async (): Promise<CommunityComments[]> => {
    const response = await fetch('/api/communityComments');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CommunityComments[] = await response.json();
    return data.filter((comment) => comment.community_post_id === paramsId);
  };

  const getUserData = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from('Users').select('*').eq('id', userId).maybeSingle();
    return data;
  };

  const deleteComment = async (id: string) => {
    const response = await fetch('/api/communityComments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const updateComment = async ({ id, content }: { id: string; content: string }): Promise<void> => {
    const response = await fetch('/api/communityComments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, content })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    getComments();
  };

  const {
    data: comments,
    isLoading,
    error
  } = useQuery({
    queryKey: ['comment', paramsId],
    queryFn: getComments,
    enabled: !!paramsId
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', paramsId] });
    }
  });

  const updateMutation = useMutation<void, Error, { id: string; content: string }>({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', paramsId] });
      setEditingCommentId(null);
      setEditContent('');
    }
  });

  const handleDelete = (commentId: string, commentUserId: string) => {
    if (userId === commentUserId) {
      deleteMutation.mutate(commentId);

      getComments();
    } else {
      console.error('삭제 권한이 없습니다.');
    }
  };

  const handleEditClick = (comment: CommunityComments) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.contents);
  };

  const handleSaveClick = (id: string) => {
    if (!editContent.trim()) {
      console.error('내용을 입력해주세요.');

      getComments();
      return;
    }
    updateMutation.mutate({ id, content: editContent });
  };

  const handleCancelClick = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from('Users').select('*');
      return data;
    },
    enabled: !!comments
  });

  const getUserNickname = (userId: string) => {
    const user = users?.find((user) => user.id === userId);
    return user ? user.nickname : 'Unknown';
  };

  return (
    <div className="flex flex-col">
      <div className="text-base flex flex-col gap-[24px]">
        {comments &&
          comments.map((comment) => (
            <div key={comment.id}>
              {editingCommentId === comment.id ? (
                <div className="flex space-y-2 p-4 border border-gray-300 rounded-md shadow-sm gap-1">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <button onClick={() => handleSaveClick(comment.id)}>저장</button>
                  <button onClick={handleCancelClick}>취소</button>
                </div>
              ) : (
                <div>
                  <p className="font-bold">{getUserNickname(comment.user_id)}</p>
                  <p>{comment.contents}</p>
                  <div className="flex gap-[24px]">
                    <p>{comment.created_at.split('T')[0]}</p>
                    <div className="flex gap-[8px] bg-gray-300 px-[8px] py-[4px] rounded-full ">
                      {/* 여기 패딩 넣으니까 갭 이상해짐 수정 바람 */}
                      <Image src="/like_logo.svg" alt="like" width={20} height={20} />
                      <p>3</p>
                    </div>
                    <div className="flex gap-1">
                      {userId === comment.user_id && (
                        <>
                          <button onClick={() => handleEditClick(comment)}>수정</button>
                          <button onClick={() => handleDelete(comment.id, comment.user_id)}>삭제</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
      <hr className="w-full h-[1px] bg-black border-0 my-[32px]" />
    </div>
  );
}
