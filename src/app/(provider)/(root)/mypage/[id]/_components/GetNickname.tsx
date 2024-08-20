import useProfile from '@/hooks/useProfile';

interface GetNicknameProp {
  userId: string;
}

export default function GetNickname({ userId }: GetNicknameProp) {
  const { userData } = useProfile(userId);
  return <p>{userData?.nickname}</p>;
}
