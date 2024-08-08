import Image from 'next/image';
import { postDumy } from './DumyData';

export default function AccountList() {
  return (
    <div>
      <section className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-10">
          <h2 className="hidden md:flex text-2xl font-bold">거래내역</h2>
        </div>

        <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
          <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24 mx-auto mb-4" />
          <div className="text-lg font-semibold mb-2">아직 거래내역이 없어요</div>
          <div className="text-sm text-gray-600 mb-4">전문가 의뢰를 통해 원하는 결과물을 받아보세요 </div>
        </div>
      </section>
    </div>
  );
}
