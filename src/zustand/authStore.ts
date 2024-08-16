import { Users } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import { create, StoreApi, UseBoundStore } from 'zustand';

// 전역 상태
// 1. isLogin : 로그인 여부 (로그인 되어 있으면 true, 아니면 false)
// 2. login() : 로그인 함수 -> isLogin를 true로 설정함
// 3. logout() : 로그아웃 함수 -> isLogin를 false로 설정함
// 4. userId : 사용자 고유 아이디(uuid)
// 5. setUserId() : 사용자 고유 아이디 설정 함수
//    -> userId를 현재 로그인 되어 있는 사용자 고유 아이디로 설정함
// 6. initializeAuthState() : 비동기 상태 초기화 함수
//    -> 컴포넌트가 마운트될 때 비동기적으로 실행됨

interface AuthState {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
  userId: Users['id'] | null;
  setUserId: (userId: Users['id'] | null) => void;
  initializeAuthState: () => Promise<void>;
}

const useAuthStore: UseBoundStore<StoreApi<AuthState>> = create<AuthState>((set) => {
  const initializeAuthState = async () => {
    const supabase = createClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session) {
      set({
        isLogin: !!session,
        userId: session?.user?.id || null
      });
    } else {
      set({
        isLogin: false,
        userId: null
      });
    }
  };

  initializeAuthState();

  return {
    isLogin: false,
    login: () => set({ isLogin: true }),
    logout: () => set({ isLogin: false, userId: null }),
    userId: null,
    setUserId: (userId) => set({ userId }),
    initializeAuthState
  };
});

export default useAuthStore;
