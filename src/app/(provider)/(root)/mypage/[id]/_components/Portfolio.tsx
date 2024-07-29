'use client';

import { useState } from 'react';
import EditPortfolio from './EditPortfolio';
import EddPortfolio from './EddPortFolio';
import { useParams } from 'next/navigation';
import type { Portfolio } from '@/types/type';
import { useQuery } from '@tanstack/react-query';

interface EditProfileProps {
  clickModal: () => void;
}

export default function Portfolio() {
  const { id } = useParams();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [eddModal, setEddModal] = useState(false);

  const getPortfolio = async () => {
    const response = await fetch('/api/portFolio');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Portfolio[] = await response.json();
    return data.filter((post) => post.user_id === id);
  };

  const { data, isLoading, error } = useQuery<Portfolio[]>({
    queryKey: ['post', id],
    queryFn: getPortfolio,
    enabled: !!id
  });

  const handleOpenModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const openEddmodal = () => {
    setEddModal(true);
  };

  const closeEddmodal = () => {
    setEddModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center  w-full ">
      <div className=" self-start flex text-2xl font-bold mb-4"> 포트폴리오</div>
      <button onClick={openEddmodal} className="mt-4 self-end bg-black text-white rounded p-3 px-6">
        포트폴리오 등록하기
      </button>

      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full bg-white border border-gray-300 rounded-md p-6 text-center h-96">
          <div className="w-24 h-24 bg-gray-200 mx-auto mb-4"></div>
          <div className="text-lg font-semibold mb-2">아직 등록된 포트폴리오가 없어요!</div>
          <div className="text-sm text-gray-600 mb-4">
            전문가로 활동하기 위해서는 포트폴리오를 등록해야 해요 / 포트폴리오를 등록하면 매칭률이 높아져요
          </div>
          <button onClick={openEddmodal} className="mt-4 bg-black text-white rounded p-3 px-6">
            포트폴리오 등록하기
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 self-start w-full">
            {data?.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-2xl">
                <div className="flex mr-20">
                  <img src="https://via.placeholder.com/150?text=Expert+1" className="w-72 h-40 rounded-lg" />
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
                    <button onClick={handleOpenModal} className="mt-4 p-2 w-64  bg-gray-400 text-xl text-white rounded">
                      포트폴리오 수정
                    </button>
                    <button
                      onClick={handleOpenModal}
                      className="mt-4 p-2 ml-5 w-64 text-xl bg-gray-400 text-white rounded"
                    >
                      포트폴리오 삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {editModalOpen && <EditPortfolio clickModal={handleCloseModal} />}
      {eddModal && <EddPortfolio clickModal={closeEddmodal} />}
    </div>
  );
}
