const btnSt = 'w-[32px] h-[32px] bg-[#585858] text-white text-[16pt] flex items-center justify-center rounded-[4px]';
// 페이지네이션 적용 후에, 조건부 서식 걸리도록 bg 다시 제어해야 함 선택되지 않은 버튼은 #D2D2D2 으로 처리

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  post_category: string;
  user_id: string;
  post_img: string[];
  lang_category: string[];
}

interface LatestProps {
  posts: Post[];
}

export default function Latest({ posts }: LatestProps) {
  return (
    <>
      <>
        엥? `
        {posts.map((post) => (
          <div key={post.id}>
            <div className="flex flex-col gap-[24px]">
              <h1 className="font-black text-[20px]">{post.title}</h1>
              <p className="font-medium text-[16px] w-[995px] h-[45px] overflow-hidden text-ellipsis line-clamp-2">
                {post.content}
              </p>
              <p className="font-medium text-[16px]">닉네임</p>
              {/* 닉네임이 테이블에 없다 이거 추가하자고 말해야겠듬 */}
            </div>
          </div>
        ))}
      </>
      <div className="mt-12 flex gap-[8px]">
        <button className={btnSt}>1</button>
        <button className={btnSt}>2</button>
        <button className={btnSt}>3</button>
        <button className={btnSt}>4</button>
        <button className={btnSt}>5</button>
      </div>
    </>
  );
}

//map이 반복되면서, 다음 div가 있을 때에만 hr이 전개되도록 수정해야 함
// 한 게시물 미리보기의 gap 24px 맞나?? 아웃라인이 안 깨져서 모르겠음
// 페이지네이션 작업 해야 함
