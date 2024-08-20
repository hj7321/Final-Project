import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET; // 환경 변수로 API 시크릿 키 관리

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const { paymentId, orderId, buyerId, proId } = await request.json();

    if (!paymentId || !orderId) {
      return NextResponse.json({ message: 'paymentId와 orderId가 필요합니다.' }, { status: 400 });
    }

    // 1. 포트원 결제내역 단건조회 API 호출
    const paymentResponse = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      headers: { Authorization: `PortOne ${PORTONE_API_SECRET}`, 'Content-Type': 'application/json' }
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json().catch(() => ({})); // 에러 데이터가 JSON이 아닌 경우 대비
      console.error('Payment fetch failed:', paymentResponse.status, paymentResponse.statusText, errorData);
      throw new Error(`Payment fetch failed: ${paymentResponse.statusText || 'Unknown error'}`);
    }

    const payment = await paymentResponse.json();

    // 3. 결제 상태에 따른 처리
    switch (payment.status) {
      case 'PAID':
        // 결제 완료 처리
        const supabase = createClient();
        const { error } = await supabase.from('Accounts').insert([
          {
            consumer_id: buyerId,
            pro_id: proId,
            request_post_id: orderId,
            is_complete: false
          }
        ]);
        if (error) {
          console.error('Supabase insert error:', error.message);
          return NextResponse.json({ message: '데이터베이스 삽입에 실패했습니다.' }, { status: 500 });
        }

        // 4. 결제 취소 처리
        const cancelResponse = await fetch(`https://api.portone.io/payments/${paymentId}/cancel`, {
          method: 'POST',
          headers: { Authorization: `PortOne ${PORTONE_API_SECRET}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason: '테스트 결제 취소'
          })
        });

        if (!cancelResponse.ok) {
          const cancelErrorData = await cancelResponse.json().catch(() => ({}));
          console.error('Cancel failed:', cancelResponse.status, cancelResponse.statusText, cancelErrorData);
          return NextResponse.json({ message: '결제 취소에 실패했습니다.' }, { status: 500 });
        }

        return NextResponse.json({ message: '결제가 성공적으로 처리되고 취소되었습니다.' }, { status: 200 });

      default:
        return NextResponse.json({ message: '알 수 없는 결제 상태입니다.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ message: `결제 검증에 실패했습니다.` }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createClient();

    // Request Posts 테이블에서 데이터 가져오기
    const { data: requestPosts, error: requestPostsError } = await supabase.from('Request Posts').select('*');

    if (requestPostsError) {
      throw new Error('Request Posts 데이터를 가져오는 데 실패했습니다.');
    }

    // account 테이블에서 데이터 가져오기
    const { data: accounts, error: accountsError } = await supabase.from('Accounts').select('*');

    if (accountsError) {
      throw new Error('account 데이터를 가져오는 데 실패했습니다.');
    }

    // Request Posts의 id와 account의 request_post_id를 비교하여 필터링
    const filteredPosts = requestPosts.filter((post) =>
      accounts.some((account) => account.request_post_id === post.id)
    );

    return NextResponse.json(filteredPosts);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' });
  }
}
