import { postDumy } from './DumyData';

export default function AccountList() {
  return (
    <div>
      <section className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-10">
          <h2 className="text-2xl font-bold">거래내역</h2>
        </div>
        <div className="space-y-4">
          {postDumy.slice(0, 4).map((post) => (
            <div key={post.id} className="bg-white p-4  rounded-2xl">
              <div className="flex mr-20">
                <img src={post.image} className="w-[180px] h-[180px] object-cover rounded-lg" alt={post.title} />
                <div className="ml-8 flex-1">
                  <p className="font-bold text-[20px] mb-2">{post.title}</p>
                  <p
                    className="text-[16px] mb-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {post.content}
                  </p>
                  <p className="text-gray-500 text-[14px] mb-2">{post.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
