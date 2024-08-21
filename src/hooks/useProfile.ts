import { Users } from '@/types/type';
import { useQuery } from '@tanstack/react-query';

export default function useProfile(userId: string | null | undefined) {
  const getUserData = async () => {
    const data = await fetch(`/api/users/${userId}`, {
      method: 'GET'
    }).then((res) => res.json());

    if (data.errorMsg) {
      console.log('유저 데이터 못가져옴: ', data.errorMsg);
      return null;
    } else {
      return data.userData;
    }
  };

  const {
    data: userData,
    isPending: isUserDataPending,
    error: userDataError
  } = useQuery<Users | null>({
    queryKey: ['User', userId],
    queryFn: getUserData,
    enabled: !!userId
  });

  return { userData, isUserDataPending, userDataError };
}
