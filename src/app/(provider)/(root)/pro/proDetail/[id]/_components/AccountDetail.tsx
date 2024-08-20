'use client';

import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import * as PortOne from '@portone/browser-sdk/v2';
import useProfile from '@/hooks/useProfile';
import { Notify } from 'notiflix';
import Image from 'next/image';
import { CodeCategories } from '@/components/dumy';

interface PostData {
  id: string;
  post_img: string[];
  content: string;
  price: number;
  title: string;
  user_id: string;
  lang_category: string[];
}

interface UserData {
  id: string; // 유저 ID 추가
  nickname: string;
  profile_img: string;
}

interface PortfolioData {
  id: string;
  user_id: string;
  title: string;
  content: string;
  portfolio_img: string;
  lang_category: string[];
  start_date: string;
  end_date: string;
}

type AccountModalProps = {
  onClose: () => void;
  post: PostData | null;
  user: UserData | null;
  portfolio: PortfolioData[];
};

const DetailAccount: React.FC<AccountModalProps> = ({ onClose, post, user, portfolio }) => {
  const { currentUserId } = useSession();
  const paymentId = `payment-${crypto.randomUUID().slice(0, 20)}`;
  const router = useRouter();

  // 리팩토링 후
  const { userData, isUserDataPending, userDataError } = useProfile(currentUserId);

  async function requestPayment(post: PostData | null) {
    if (!post) {
      console.error('Post data is not available');
      return;
    }

    try {
      const response = await PortOne.requestPayment({
        storeId: 'store-ffd570b5-f558-4f58-abc1-12d5db5a33e0',
        channelKey: 'channel-key-584a8128-bbef-438f-8d11-7d7ab2d8c1d9',
        paymentId: paymentId,
        orderName: post.title,
        totalAmount: post.price,
        currency: 'CURRENCY_KRW',
        payMethod: 'CARD',
        customer: {
          fullName: userData?.nickname,
          phoneNumber: '010-0000-1234',
          email: userData?.email
        }
        // redirectUrl: `${process.env.BASE_URL}/payment-redirect`,
        // redirectUrl: `http://localhost:3000/payment-redirect`
      });

      // 결제 성공 시 서버에 알림
      const notified = await fetch(`/api/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentId,
          orderId: post.id,
          buyerId: currentUserId,
          proId: post.user_id
        })
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      Notify.success('결제가 완료되었습니다.');
      router.push(`/completedAccount/${paymentId}?post_id=${post.id}`);
    } catch (error) {
      console.error('Payment failed:', error);
      Notify.failure('결제에 실패했습니다. 다시 시도해주세요.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-0 md:p-0">
      <div className="bg-white md:p-5 md:rounded-xl w-full md:w-1/4 max-w-xl h-full md:h-3/6">
        <div></div>
        <div className="flex flex-col ml-[20px]">
          <button
            onClick={onClose}
            className=' className="absolute top-2 right-4 text-grey-600 flex font-thin justify-end "'
          >
            x
          </button>
          <h2 className="flex">
            <Image src={user?.profile_img || '/defaultProfileimg.svg'} alt="프로필이미지" width={60} height={60} />
            <div className="ml-3 mt-4 text-black font-bold">{user?.nickname}</div>
          </h2>
          <div className="flex items-center mt-4 ml-0">
            {post && (
              <div className="flex">
                {post.lang_category.map((category, index) => {
                  const categoryImage =
                    CodeCategories.find((cat) => cat.name === category)?.image || '/defaultProfileimg.svg';
                  return (
                    <div key={index} className="flex items-center mr-2">
                      <Image src={categoryImage} alt={category} width={12} height={12} className="w-5 h-5 mb-3" />
                      <p className="text-sm ml-1 text-grey-600 font-bold mb-3">{category}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className=" text-xl font-bold">{post?.title}</div>
          <div className="hidden md:flex border-t  border-grey-300 my-10"></div>
          <div className="flex">
            <p className="text-2xl text-grey-800 font-bold">결제 금액</p>
            <p className="ml-1 mt-1 text-grey-400">(VAT 포함)</p>{' '}
            <p className=" ml-3 text-2xl text-grey-800 font-bold">{post?.price} 원 </p>
          </div>

          <h3 className="mt-4"></h3>
          <button onClick={() => requestPayment(post)} className="mt-4 p-2 py-4 bg-primary-500 text-white rounded">
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailAccount;
