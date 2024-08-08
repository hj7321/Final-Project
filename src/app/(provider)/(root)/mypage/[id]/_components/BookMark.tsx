import Image from 'next/image';

export default function BookMark() {
  return (
    <section className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="hidden md:flex text-2xl font-bold">찜 목록</h2>
      </div>
      <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
        <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24  mx-auto mb-4" />
        <div className="text-lg font-semibold mb-2">아직 찜을 한 게시글이 없어요</div>
        <div className="text-sm text-gray-600 mb-4">코듀를 둘러보면서 마음에 드는 게시글을 찾아보세요!</div>
      </div>
    </section>
  );
}
