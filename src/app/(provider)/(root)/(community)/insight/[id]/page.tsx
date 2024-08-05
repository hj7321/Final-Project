'use client';

import CommuCommentList from '../../_components/CommuCommentList';
import CommuComment from '../../_components/CommuComment';
import CommuPost from '../../_components/CommuPost';

export default function page() {
  return (
    <div className="mt-[110px] flex flex-col gap-16">
      {/* <button className="w-16 h-16 rounded-full border border-black flex items-center justify-center">←</button> */}
      {/* 이후 아이콘으로 변경 */}
      <div className="flex flex-col gap-16">
        <CommuPost />
        <CommuComment />
        <CommuCommentList />
      </div>
    </div>
  );
}
