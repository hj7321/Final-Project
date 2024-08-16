import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import { CommunityComments } from '@/types/type';

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

  return (
    <div key={comment.id}>
      {editingCommentId === comment.id ? (
        <div className="flex space-y-2 p-4 border border-gray-300 rounded-md shadow-sm gap-1">
          <MDEditor height={100} value={editContent} onChange={setEditContent} commands={[]} />
          <button onClick={() => handleSaveClick(comment.id)}>저장</button>
          <button onClick={handleCancelClick}>취소</button>
        </div>
      ) : (
        <div>
          <p className="font-bold">{getUserNickname(comment.user_id)}</p>
          <MDEditor.Markdown source={comment.contents} />
          <div className="flex gap-[24px]">
            <p>{comment.created_at.split('T')[0]}</p>
            <div
              onClick={() => setIsClicked((prev) => !prev)}
              className="flex gap-[8px] bg-gray-300 px-[8px] py-[4px] rounded-full "
            >
              {isClicked ? (
                <Image src="/like_logo.svg" alt="like" width={20} height={20} />
              ) : (
                <Image src="/like_logo_dark.svg" alt="like" width={20} height={20} />
              )}
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
  );
}
