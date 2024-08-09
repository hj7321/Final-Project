import { Users } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import { UserMetadata } from '@supabase/supabase-js';
// import { useQuery } from '@tanstack/react-query';
import { create, StoreApi, UseBoundStore } from 'zustand';

// 전역 상태
// 1. isLoading : 로딩 여부 (로딩 중이면 true, 아니면 false)
// 2. isLogin : 로그인 여부 (로그인 되어 있으면 true, 아니면 false)
// 3. isPro : 사용자의 유형이 전문가인지 판단하는 여부
//            (로그인 되어 있을 때 전문가이면 true,
//             로그인 되어 있을 때 일반 사용자이면 false,
//             로그인 되어 있지 않으면 null)
// 4. userId : 사용자 고유 아이디(uuid)
// 5. userData : 사용자 개인 정보(생년월일, 닉네임, 이메일, 이름, 프로필 이미지 URL, 사용자 타입)
// 6. login() : 로그인 함수 -> isLogin를 true로 설정함
// 7. logout() : 로그아웃 함수 -> isLogin를 false로 설정함
// 8. setUserId() : 사용자 고유 아이디 설정 함수
//    -> userId를 현재 로그인 되어 있는 사용자 고유 아이디로 설정함
// 9. setUserData() : 사용자 개인 정보 설정 함수
//    -> userData를 현재 로그인 되어 있는 사용자 개인 정보로 설정함
// 10. initializeAuthState() : 비동기 상태 초기화 함수
//     -> 컴포넌트가 마운트될 때 비동기적으로 실행됨

interface AuthState {
  isLoading: boolean;
  isLogin: boolean;
  isPro: boolean | null;
  userId: Users['id'] | null;
  userData: UserMetadata | null;
  login: () => void;
  logout: () => void;
  setUserId: (userId: Users['id'] | null) => void;
  setUserData: (userData: UserMetadata | null) => void;
  initializeAuthState: () => Promise<void>;
}

const useAuthStore: UseBoundStore<StoreApi<AuthState>> = create<AuthState>((set) => {
  const initializeAuthState = async () => {
    set({ isLoading: true });

    const supabase = createClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    console.log(session);

    if (session) {
      console.log('동작함');
      const { data } = await supabase.from('Users').select('is_pro').eq('id', session.user.id);
      // userId에 맞는 데이터 가져오기
      // const data = await supabase.from('Users').select('*').eq('id', userId!).maybeSingle();
      // const { data: userData } = useQuery({
      //   queryKey: [session.user.id],
      //   queryFn: async () => {
      //     const data = await supabase.from('Users').select('*').eq('id', session.user.id!).maybeSingle();
      //   }
      // });

      set({
        isLoading: false,
        isLogin: !!session,
        isPro: data && data[0]?.is_pro,
        userId: session?.user?.id || null,
        userData: session?.user?.user_metadata || null
      });
    } else {
      set({
        isLoading: false,
        isLogin: false,
        isPro: null,
        userId: null,
        userData: null
      });
    }
  };

  initializeAuthState();

  return {
    isLoading: true,
    isLogin: false,
    isPro: null,
    userId: null,
    userData: null,
    login: () => set({ isLogin: true }),
    logout: () => set({ isLogin: false, isPro: null, userId: null, userData: null }),
    setUserId: (userId) => set({ userId }),
    setUserData: (userData) => set({ userData }),
    initializeAuthState
  };
});

export default useAuthStore;
