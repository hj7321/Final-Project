import { Users } from '@/types/type';
import { createClient } from '@/utils/supabase/client';
import { UserMetadata } from '@supabase/supabase-js';
import { create, StoreApi, UseBoundStore } from 'zustand';

// 전역 상태에서 정의해야 할 것
// 1. 로그인 여부
// 2. 사용자 고유 아이디(uuid)
// 3. 사용자 개인 정보(생년월일, 닉네임, 이메일, 이름, 프로필 이미지 URL, 사용자 타입)
// 3. 로그인 함수: isLogin를 true로 설정함
// 4. 로그아웃 함수: isLogin를 false로 설정함
// 5. 사용자 고유 아이디 설정 함수: userId를 현재 로그인 되어 있는 사용자 고유 아이디로 설정함
// 6. 사용자 개인 정보 설정 함수: userData를 현재 로그인 되어 있는 사용자 개인 정보로 설정함

interface AuthState {
  isLoading: boolean;
  isLogin: boolean;
  userId: Users['id'] | null;
  userData: UserMetadata | null;
  login: () => void;
  logout: () => void;
  setUserId: (userId: Users['id'] | null) => void;
  setUserData: (userData: UserMetadata | null) => void;
  initializeAuthState: () => Promise<void>;
}

const useAuthStore: UseBoundStore<StoreApi<AuthState>> = create<AuthState>((set) => {
  // 로그인 상태를 초기화하는 함수
  const initializeAuthState = async () => {
    set({ isLoading: true });

    const supabase = createClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    // const session = await fetch('/api/auth', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then((res) => res.json());
    console.log(session);

    set({
      isLogin: !!session,
      userId: session?.user?.id || null,
      userData: session?.user?.user_metadata || null,
      isLoading: false
    });
  };

  initializeAuthState();

  return {
    isLoading: true,
    isLogin: false,
    userId: null,
    userData: null,
    login: () => set({ isLogin: true }),
    logout: () => set({ isLogin: false, userId: null, userData: null }),
    setUserId: (userId) => set({ userId }),
    setUserData: (userData) => set({ userData }),
    initializeAuthState
  };
});

export default useAuthStore;
