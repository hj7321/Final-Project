import { NextApiRequest, NextApiResponse } from 'next';

// 필요한 서비스 모듈 또는 라이브러리 임포트
// import OrderService from '@/services/OrderService';

const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET; // 환경 변수로 API 시크릿 키 관리

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { paymentId, orderId } = req.body;

    if (!paymentId || !orderId) {
      return res.status(400).json({ message: 'paymentId와 orderId가 필요합니다.' });
    }

    // 1. 포트원 결제내역 단건조회 API 호출
    const paymentResponse = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      headers: { Authorization: `PortOne ${PORTONE_API_SECRET}` }
    });
    console.log('paymentResponse', paymentResponse);

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      throw new Error(`Payment fetch failed: ${errorData.message}`);
    }

    const payment = await paymentResponse.json();

    // 2. 주문 금액과 실제 결제 금액 비교
    // const order = await OrderService.findById(orderId); // OrderService는 필요에 따라 구현해야 합니다.
    // if (order.amount !== payment.amount.total) {
    //   return res.status(400).json({ message: '결제 금액이 주문 금액과 일치하지 않습니다.' });
    // }

    // 3. 결제 상태에 따른 처리
    switch (payment.status) {
      //   case 'VIRTUAL_ACCOUNT_ISSUED':
      //     // 가상 계좌 발급 처리
      //     break;

      case 'PAID':
        // 결제 완료 처리
        // 필요에 따라 구현해야 합니다.
        res.status(200).json({ message: '결제가 성공적으로 처리되었습니다.' });

        break;

      default:
        return res.status(400).json({ message: '알 수 없는 결제 상태입니다.' });
    }

    // res.status(200).json({ message: '결제가 성공적으로 처리되었습니다.' });
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ message: `결제 검증에 실패했습니다: ` });
  }
}
