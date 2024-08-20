import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import { CommunityComments, CommunityLikes } from '@/types/type';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/zustand/authStore';
import { Notify } from 'notiflix';
import Cookies from 'js-cookie';

interface CommentProps {
  comment: CommunityComments;
  userId: string | null;
  getUserNickname: (userId: string) => string;
  handleDelete: (commentId: string, commentUserId: string) => void;
  handleEditClick: (comment: CommunityComments) => void;
  handleSaveClick: (id: string) => void;
  handleCancelClick: () => void;
  editingCommentId: string | null;
  editContent: string | undefined;
  setEditContent: (content: string) => void;
}

type LikesData = {
  data: CommunityLikes[];
  count: number;
};

export default function Comment({
  comment,
  userId,
  getUserNickname,
  handleDelete,
  handleEditClick,
  handleSaveClick,
  handleCancelClick,
  editingCommentId,
  editContent,
  setEditContent
}: CommentProps) {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const { isLogin } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const commentId = comment.id;

  const handleGetLikesData = async (): Promise<LikesData | undefined> => {
    const { data, count } = await fetch(`/api/commentsLike/${commentId}`).then((res) => res.json());
    if (data.errorMsg) {
      console.log(data.errorMsg);
      return;
    }
    console.log(data);
    return { data, count };
  };

  const { data: likesData } = useQuery<LikesData | undefined>({
    queryKey: ['like', commentId],
    queryFn: handleGetLikesData
  });

  const handleAddLike = async () => {
    const data = await fetch(`/api/commentsLike/${commentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ commentId, userId })
    }).then((res) => res.json());

    return data;
  };

  const handleDeleteLike = async () => {
    const data = await fetch(`/api/commentsLike/${commentId}?userId=${userId}`, {
      method: 'DELETE'
    }).then((res) => res.json());

    return data;
  };

  const { mutate: addLike } = useMutation({
    mutationFn: handleAddLike,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['like', commentId] });
      const previousData = queryClient.getQueryData<LikesData>(['like', commentId]);
      queryClient.setQueryData(['like', commentId], (prev: { data: CommunityLikes[]; count: number }) => {
        const newData = {
          comment_id: commentId,
          user_id: userId
        };
        return { data: [...prev.data, newData], count: prev.count + 1 };
      });
      return { previousData };
    },
    onError: (error, _, context) => {
      console.log(error.message);
      queryClient.setQueryData(['like', commentId], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['like', commentId] });
    }
  });

  const { mutate: deleteLike } = useMutation({
    mutationFn: handleDeleteLike,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['like', commentId] });
      const previousData = queryClient.getQueryData<LikesData>(['like', commentId]);
      queryClient.setQueryData(['like', commentId], (prev: { data: CommunityLikes[]; count: number } | undefined) => {
        if (!prev) return { data: [], count: 0 };
        const updatedData = prev.data.filter((item) => item.user_id !== userId);
        return { data: updatedData, count: updatedData.length };
      });
      return { previousData };
    },
    onError: (error, _, context) => {
      console.log(error.message);
      queryClient.setQueryData(['like', commentId], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['like', commentId] });
    }
  });

  console.log(deleteLike);
  console.log(addLike);

  const handleToggleLike = () => {
    if (!isLogin) {
      Notify.failure('로그인 후 이용해주세요.');
      const presentPage = window.location.href;
      const pagePathname = new URL(presentPage).pathname;
      Cookies.set('returnPage', pagePathname);
      router.push('/login');
    } else {
      if (likesData?.data.find((item) => item.user_id === userId)) {
        deleteLike();
      } else {
        addLike();
      }
    }
  };

  return (
    <div key={comment.id}>
      {editingCommentId === comment.id ? (
        <div className="flex space-y-2 p-4 border border-grey-300 rounded-md shadow-sm gap-1" data-color-mode="light">
          <MDEditor height={100} value={editContent} onChange={() => setEditContent} commands={[]} />
          <button onClick={() => handleSaveClick(comment.id)}>저장</button>
          <button onClick={handleCancelClick}>취소</button>
        </div>
      ) : (
        <div data-color-mode="light">
          <p className="font-bold">{getUserNickname(comment.user_id)}</p>
          <MDEditor.Markdown source={comment.contents} />
          <div className="flex gap-[24px] items-center">
            <p className="text-[16px] text-grey-400">{comment.created_at.split('T')[0]}</p>
            <div
              onClick={handleToggleLike}
              className="flex w-[60px] gap-[8px] text-grey-400 bg-grey-100 px-[8px] py-[4px] rounded-[16px] items-center justify-center "
            >
              {likesData?.data.find((item) => item.user_id === userId) ? (
                <Image src="/like_logo.svg" alt="좋아요 O" width={20} height={20} />
              ) : (
                <Image src="/like_logo_dark.svg" alt="좋아요 X" width={20} height={20} />
              )}
              <p>{likesData?.count}</p>
            </div>
            <div className="flex ml-auto gap-4">
              {userId === comment.user_id && (
                <>
                  <button
                    onClick={() => handleEditClick(comment)}
                    className="px-[16px] py-[8px] flex items-center justify-center gap-1 rounded-[8px] border border-solid border-primary-500"
                  >
                    <Image src="/pencil_color.svg" alt="수정" width={24} height={24} />
                    <p className="text-primary-500">댓글 수정</p>
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id, comment.user_id)}
                    className="px-[16px] py-[8px] flex items-center justify-center gap-1 bg-grey-300 rounded-[8px]"
                  >
                    <Image src="/trashCan_color.svg" alt="삭제" width={24} height={24} />
                    <p className="text-white">댓글 삭제</p>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
