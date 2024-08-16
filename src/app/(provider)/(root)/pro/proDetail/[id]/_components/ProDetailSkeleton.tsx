import React from "react";
import {Card, Skeleton} from "@nextui-org/react";

export default function ProDetailSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto md:p-4 pl-4 pr-4 pb-4">
    <div className="w-[60px] h-[60px] md:w-[120px] md:h-[120px]">
      <button>
        <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16.25" y="16.25" width="31.5" height="31.5" rx="15.75" stroke="#9FA8B2" strokeWidth="0.5" />
          <path
            d="M36 31.75C36.1381 31.75 36.25 31.8619 36.25 32C36.25 32.1381 36.1381 32.25 36 32.25V31.75ZM27.8232 32.1768C27.7256 32.0791 27.7256 31.9209 27.8232 31.8232L29.4142 30.2322C29.5118 30.1346 29.6701 30.1346 29.7678 30.2322C29.8654 30.3299 29.8654 30.4882 29.7678 30.5858L28.3536 32L29.7678 33.4142C29.8654 33.5118 29.8654 33.6701 29.7678 33.7678C29.6701 33.8654 29.5118 33.8654 29.4142 33.7678L27.8232 32.1768ZM36 32.25H28V31.75H36V32.25Z"
            fill="#828F9B"
          />
        </svg>
      </button>
    </div>

    <div className="flex md:flex-row flex-col-reverse justify-between items-center">
      <div className="md:h-[514px] md:w-[390px] w-[330px] h-[80px] md:border-2 rounded-xl flex flex-col items-center">
        <div className="flex-col flex md:flex-col">
          <div className="flex flex-row md:flex-col">
            <div className="md:h-[150px] md:w-[150px] w-[64px] h-[64px] border-2 rounded-full md:mx-auto mx-2 mt-5 bg-grey-50">
            </div>
            <div className="md:mx-auto mx-2 mt-4 flex-col md:justify-center justify-start md:text-center text-start">
              <p className="md:text-2xl text-base md:pl-[0px] pl-1 md:mb-[0px] bg-grey-50 w-[220px] h-[24px] rounded-xl  md:h-[32px]"></p>
              <div className="mx-auto flex flex-col md:items-center item-start justify-center font-thin md:mt-5">
                <div className="flex flex-row mt-1 md:mt-[0px] mx:auto  w-[220px] h-[21px] md:h-[24px] bg-grey-50 rounded-xl">
                </div>
                <div className="flex flex-row mt-1 w-[220px] h-[21px] md:h-[24px] bg-grey-50 rounded-xl">
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto md:mt-5 my-3 md:w-[30ch] w-120px md:h-[72px] h-[32px] rounded-xl md:min-h-[50px] bg-grey-50">
            <p className="md:w-[30ch] w-[330px] md:h-[72px] rounded-xl md:min-h-[50px] bg-grey-50"></p>
          </div>
          <div className="mx-auto md:w-[85%] w-full md:mt-5 my-2 flex flex-row justify-between items-center">
            <button
              className="md:w-full md:h-[40px] w-[160px] h-[36px] py-2 rounded-xl flex flex-row justify-center items-center bg-grey-50"
            >
            </button>
            <button className="md:w-full md:h-[40px] w-[160px] h-[36px] py-2 rounded-xl md:mt-2 flex flex-row justify-center bg-grey-50 items-center">
            </button>
          </div>
        </div>
      </div>
      <div className="md:h-[514px] md:w-[810px] w-[330px] h-[180px] border-2 rounded-xl bg-grey-50">
      </div>
    </div>

    <div className="md:mt-8 mt-[120px] bg-grey-50">
      <div className="flex md:justify-start justify-start rounded-2xl md:p-4 p-3 sticky md:top-[71px] top-[55px] bg-grey-50 h-[46px] mt-2 md:h-[58px] md:mt-[0px]">
      </div>
    </div>
    <div className="mt-[10px] h-[400px] md:h-[700px] rounded-xl bg-grey-50">

    </div>
  </div>
  );
}
