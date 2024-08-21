'use client';

import CommuCommentList from '../../_components/CommuCommentList';
import CommuComment from '../../_components/CommuComment';
import CommuPost from '../../_components/CommuPost';

export default function page() {
  return (
    <div className="md:mt-[110px]  mt-[32px] flex flex-col gap-16">
      <div className="flex flex-col gap-16">
        <CommuPost />
        <CommuComment />
        <CommuCommentList />
      </div>
    </div>
  );
}
