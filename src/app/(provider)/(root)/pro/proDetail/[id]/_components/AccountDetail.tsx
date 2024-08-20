'use client';

import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import * as PortOne from '@portone/browser-sdk/v2';
import useProfile from '@/hooks/useProfile';
import { Notify } from 'notiflix';

interface PostData {
  id: string;
  post_img: string[];
  content: string;
  price: number;
  title: string;
  user_id: string;
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
      <div className="bg-white md:p-5 md:rounded-xl w-full md:w-1/3 max-w-xl h-full md:h-5/6">
        <div>
          <button onClick={onClose}>x</button>
        </div>
        <div>
          <h2>{user?.nickname}님의 상품입니다.</h2>
          <p>price: {post?.price}</p>

          <h3>Portfolios:</h3>
          {portfolio.map((item) => (
            <div key={item.id}>
              <p>{item.title}</p>
            </div>
          ))}
          <button onClick={() => requestPayment(post)} className="mt-4 p-2 bg-blue-500 text-white rounded">
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailAccount;
