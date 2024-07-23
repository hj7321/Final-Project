import { postDumy } from './DumyData';

export default function MyPostList() {
  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      <div className=" mb-10">
        <h2 className="text-2xl font-bold">내가 쓴 글</h2>
      </div>
      <div className="space-y-4  ">
        {postDumy.slice(0, 4).map((post) => (
          <div key={post.id} className="bg-white p-4 border border-gray-400 rounded-2xl">
            <h3 className="font-bold text-[20px] ml-8 mb-8 mt-6">{post.title}</h3>
            <p
              className=" text-[16px] ml-8 mb-6 mr-5"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {post.content}
            </p>
            <p className="ml-8 mb-3">
              <span className="text-gray-500 text-[14px] mr-10  ">{post.date}</span>
              <span className="text-gray-500 text-[14px] mr-10"> view:{post.view}</span>
              <span className="text-gray-500 text-[14px]"> like:{post.like}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
