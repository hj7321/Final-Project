import Image from 'next/image';

export default function SendReview() {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-white border border-grey-300 rounded-md p-6 text-center h-96">
      <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24  mx-auto mb-4" />
      <div className="text-lg font-semibold mb-2">아직 작성한 리뷰가 없어요</div>
      <div className="text-sm text-grey-600 mb-4">전문가 의뢰를 받아보고 리뷰를 작성해 보세요!</div>
    </div>
  );
}
