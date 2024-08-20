'use client';

import { CommunityComments } from '@/types/type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import useAuthStore from '@/zustand/authStore';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import Comment from './Comment';

export default function CommuCommentList() {
  const { id: paramsId } = useParams();
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string | undefined>('');

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
      const isConfirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');

      if (isConfirmed) {
        deleteMutation.mutate(commentId);
        getComments();
      }
    } else {
      console.error('삭제 권한이 없습니다.');
    }
  };

  const handleEditClick = (comment: CommunityComments) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.contents);
  };

  const handleSaveClick = (id: string) => {
    if (!editContent?.trim()) {
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

  // const getBookmarkData = async () => {
  //   const { data, count } = await fetch(`/api/commentLike/${id}`).then((res) => res.json());
  //   if (data.errorMsg) {
  //     console.log(data.errorMsg);
  //     return;
  //   }
  //   return {
  //     data,
  //     count
  //   };
  // };

  // const { data: bookmarkData } = useQuery({
  //   queryKey: ['bookmarkCount', id],
  //   queryFn: () => getBookmarkData()
  // });

  return (
    <div className="flex flex-col">
      <div className="text-base flex flex-col gap-[24px]">
        {comments &&
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              userId={userId}
              getUserNickname={getUserNickname}
              handleDelete={handleDelete}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              editingCommentId={editingCommentId}
              editContent={editContent}
              setEditContent={setEditContent}
            />
          ))}
      </div>
      <hr className="w-full h-[1px] bg-grey-100 border-0 my-[32px]" />
    </div>
  );
}
