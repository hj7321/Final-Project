import { useUserData } from '@/app/api/mypage/[id]/route';
import { Users } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface EditPortfolioProps {
  clickModal: () => void;
}

const EditPortfolio: React.FC<EditPortfolioProps> = ({ clickModal }) => {
  const params = useParams();

  const id = params.id as string;

  const { data: userData, isLoading, error } = useUserData(id);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="h-screen flex items-center justify-center">Error: {error.message}</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[800px] h-[80%] relative overflow-auto">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={clickModal}>
          x
        </button>
        <div className="flex">
          <div className="w-[30%] pr-4">
            <h1 className="text-2xl font-bold mb-4"> {userData?.data?.nickname}</h1>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700"> 프로젝트 이름</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">프로젝트 설명</label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">태그</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">참여 기간</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  저장
                </button>
              </div>
            </div>
          </div>
          <div className="w-[70%]">
            <label className="block text-sm font-medium text-gray-700">사진</label>
            <div className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm">
              <input
                type="file"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              <div className="mt-4 flex flex-wrap space-y-4">{/* 사진을 여기에 추가하면 됩니다 */}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolio;
