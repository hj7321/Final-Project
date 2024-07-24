import { Users } from './type';

type UserData = {
  birth: string;
  displayName: string;
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
};

export type AuthState = {
  isLogin: boolean;
  userId: Users['id'] | null;
  userData: UserData | null;
  login: () => void;
  logout: () => void;
  setUserId: (userId: Users['id'] | null) => void;
  setUserData: (userData: UserData | null) => void;
};
