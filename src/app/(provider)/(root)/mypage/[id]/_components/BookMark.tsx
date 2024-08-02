import { expertData } from '@/components/dumy';

export default function BookMark() {
  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">찜 목록</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {expertData.slice(0, 8).map((expert) => (
          <div key={expert.id} className="bg-white p-2 shadow rounded">
            <img src={expert.image} alt={expert.title} className="w-[242.5px] h-[162px] object-cover mb-4" />
            <h3 className="font-bold text-[16px]">{expert.title}</h3>
            <p className="font-bold text-[18px]">{expert.price}</p>
            <span className="text-gray-500 text-[14px]">{expert.language}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
