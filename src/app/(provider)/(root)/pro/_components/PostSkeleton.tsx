'use client';

export default function PostSkeleton() {
  return (
    <div className="grid grid-cols-1 mx-auto">
      <div className="lg:w-[300px] lg:h-[300px] w-[160px] h-[240px] rounded-lg xl:m-[30px] border border-grey-50 m-[10px] hover:scale-105 md:hover:scale-110 transition-transform duration-200">
        <div className="md:w-[280px] bg-grey-50 w-[140px] xl:h-[160px] h-[130px] rounded-lg object-cover mt-2 mx-auto" />
        <div className="flex flex-col p-2 h-[140px]">
          <div>
            <div className="flex flex-row">
              <p className="text-sm lg:mb-2 lg:mr-3 flex w-[60px] md:w-[140px] md:h-[28px] bg-grey-50 h-[16px] rounded-md"></p>
            </div>
            <p className="text-xs lg:text-sm mt-2 w-[142px] md:w-[282px] h-[32px] md:h-[36px] bg-grey-50 rounded-lg"></p>
          </div>
          <p className="mt-2 lg:mt-2 w-[80px] md:w-[160px] md:h-[28px] h-[20px] bg-grey-50 rounded-lg"></p>
        </div>
      </div>
    </div>
  );
}
