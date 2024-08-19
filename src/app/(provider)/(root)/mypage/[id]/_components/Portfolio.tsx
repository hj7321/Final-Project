'use client';

import { useEffect, useState } from 'react';
import EditPortfolio from './EditPortfolio';
import { useParams } from 'next/navigation';
import type { Portfolio } from '@/types/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DetailModal from './DetailPortfolio';
import AddPortfolio from './AddPortFolio';
import Image from 'next/image';
import { CodeCategories } from '@/components/dumy';
import { Confirm, Notify } from 'notiflix';
import MobileDetailPortfolio from './MobileDetailPortfolio';
import MobileAddPortfolio from './MobileAddPortfolio';

interface EditProfileProps {
  clickModal: () => void;
}

interface PoData {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  content: string;
  portfolio_img: string[];
  lang_category: string;
}

export default function Portfolio() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const params = useParams();
  const paramsId = params.id as string;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [eddModal, setEddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [showTestComponent, setShowTestComponent] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

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

  const handleOpenModal = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const openEddmodal = () => {
    const isMdScreen = window.innerWidth >= 768;

    if (isMdScreen) {
      setEddModal(true);
    } else {
      setShowAddModal(true);
    }
  };

  const closeEddmodal = () => {
    setEddModal(false);
  };

  const openDetailModal = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setDetailModal(true);
  };

  const closeDetailModal = () => {
    setDetailModal(false);
  };

  const deleteComment = async (id: string) => {
    const response = await fetch('/api/portFolio', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const { mutate: deleteMutation } = useMutation<PoData, Error, string>({
    mutationFn: (id) => deleteComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['porifolio', paramsId] })
  });

  const handleDelete = (id: string) => {
    Confirm.show(
      '댓글 삭제',
      '정말로 삭제하시겠습니까?',
      '예',
      '아니오',
      () => {
        Notify.failure('삭제되었습니다.');
        try {
          deleteMutation(id);
        } catch (error) {
          console.error('삭제에 실패했습니다.', error);
        }
      },
      () => {
        Notify.failure('삭제가 되지 않았습니다.');
      },
      {}
    );
  };

  const handleDetailNavigation = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    const isMdScreen = window.innerWidth >= 768;
    if (isMdScreen) {
      openDetailModal(portfolioId);
    } else {
      setShowTestComponent(true);
    }
  };

  const handleBack = () => {
    setShowTestComponent(false);
  };

  const handleClose = () => {
    setShowAddModal(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && detailModal) {
        setShowTestComponent(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [detailModal]);

  if (showTestComponent) {
    return <MobileDetailPortfolio portfolioId={selectedPortfolioId} onBack={handleBack} />;
  }

  if (showAddModal) {
    return <MobileAddPortfolio onBack={handleClose} />;
  }

  return (
    <div className="flex flex-col items-center justify-center  w-full ">
      <div className=" self-start hidden md:flex text-2xl font-bold mb-4"> 포트폴리오</div>

      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full bg-white border border-grey-300 rounded-md p-6 text-center h-96">
          <Image src="/cryingLogo.svg" alt="cryingLogo" width={30} height={30} className="w-24 h-24  mx-auto mb-4" />
          <div className="text-lg font-semibold mb-2">아직 등록된 포트폴리오가 없어요!</div>
          <div className="text-sm text-grey-600 mb-4">
            전문가로 활동하기 위해서는 포트폴리오를 등록해야 해요 / 포트폴리오를 등록하면 매칭률이 높아져요
          </div>
          <button onClick={openEddmodal} className="mt-4 bg-primary-500 text-white rounded p-3 px-6">
            포트폴리오 등록 +
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 self-start w-full">
            <div className="flex justify-end">
              <button
                onClick={openEddmodal}
                className="mt-4 self-end bg-primary-500 text-white rounded p-2 px-6 text-xl font-normal"
              >
                + 포트폴리오 등록
              </button>
            </div>
            {data?.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-2xl">
                <div className="flex mr-20">
                  <Image
                    src={
                      post.portfolio_img && post.portfolio_img.length > 0
                        ? post.portfolio_img[0]
                        : 'https://via.placeholder.com/150?text=No+Image'
                    }
                    alt="썸네일 이미지"
                    width={288}
                    height={160}
                    className="md:w-72 md:h-40 w-[64px] h-[64px] rounded-lg cursor-pointer transition-transform duration-200 md:hover:scale-110 delay-100"
                    onClick={() => handleDetailNavigation(post.id)}
                  />
                  <div className="ml-8 flex-1">
                    <div className="flex items-center mb-2">
                      <Image
                        src={
                          CodeCategories.find((category) => category.name === post.lang_category)?.image ||
                          '/defaultProfileimg.svg'
                        }
                        alt="d"
                        width={12}
                        height={12}
                        className="w-5 h-5 "
                      />
                      <p className="text-sm font-extralight text-grey-500 ml-2">{post.lang_category}</p>
                    </div>
                    <p className="font-bold text-[25px] mb-1">{post.title}</p>
                    <p className="text-sm text-grey-500">
                      {post.start_date} ~ {post.end_date}
                    </p>
                    <p
                      className="text-[16px] mb-2"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    ></p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleOpenModal(post.id)}
                        className="mt-4 p-1 md:p-2 w-40 md:w-64 text-base md:text-xl border border-primary-500 text-primary-500 hover:bg-primary-50  rounded"
                      >
                        포트폴리오 수정
                      </button>

                      <Image
                        alt="쓰레기통"
                        src="/trashCan.svg"
                        width={8}
                        height={8}
                        onClick={() => handleDelete(post.id)}
                        className="md:hidden mt-4 p-1 ml-5 w-8 cursor-pointer "
                      />

                      <button
                        onClick={() => handleDelete(post.id)}
                        className="hidden md:grid mt-4 p-2 ml-5 w-64 text-xl border border-primary-500 text-primary-500 hover:bg-primary-50  rounded"
                      >
                        포트폴리오 삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {editModalOpen && <EditPortfolio clickModal={handleCloseModal} portfolioId={selectedPortfolioId} />}
      {detailModal && <DetailModal clickModal={closeDetailModal} portfolioId={selectedPortfolioId} />}
      {eddModal && <AddPortfolio clickModal={closeEddmodal} />}
    </div>
  );
}
