import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CommunityPosts, RequestPosts, Users } from '@/types/type';

type CombinedPost = (CommunityPosts & { category: 'Community' }) | (RequestPosts & { category: 'Request' });

const useSearchPosts = (query: string) => {
  const [results, setResults] = useState<CombinedPost[]>([]);
  const [filteredResults, setFilteredResults] = useState<CombinedPost[]>([]);
  const [counts, setCounts] = useState({ total: 0, qna: 0, insight: 0, request: 0 });
  const [userMap, setUserMap] = useState<{ [key: string]: string }>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const [communityPostsResponse, requestPostsResponse, usersResponse] = await Promise.all([
        supabase.from('Community Posts').select('*'),
        supabase.from('Request Posts').select('*'),
        supabase.from('Users').select('id, nickname')
      ]);

      const communityPosts = communityPostsResponse.data as CommunityPosts[];
      const requestPosts = requestPostsResponse.data as RequestPosts[];
      const users = usersResponse.data as Users[];

      if (communityPostsResponse.error) {
        console.error('Community Posts error:', communityPostsResponse.error.message);
      }
      if (requestPostsResponse.error) {
        console.error('Request Posts error:', requestPostsResponse.error.message);
      }
      if (usersResponse.error) {
        console.error('Users error:', usersResponse.error.message);
      }

      if (communityPosts && requestPosts) {
        const combinedPosts: CombinedPost[] = [
          ...communityPosts.map((post) => ({ ...post, category: 'Community' } as CombinedPost)),
          ...requestPosts.map((post) => ({ ...post, category: 'Request' } as CombinedPost))
        ];

        const lowerQuery = query.toLowerCase();
        const filteredResults = combinedPosts.filter(
          (item) =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.content.toLowerCase().includes(lowerQuery) ||
            (item.lang_category && item.lang_category.some((lang) => lang.toLowerCase().includes(lowerQuery)))
        );

        const counts = {
          total: filteredResults.length,
          qna: filteredResults.filter((item) => item.category === 'Community' && item.post_category === 'QnA').length,
          insight: filteredResults.filter((item) => item.category === 'Community' && item.post_category === 'Insight')
            .length,
          request: filteredResults.filter((item) => item.category === 'Request').length
        };

        setResults(filteredResults);
        setFilteredResults(filteredResults);
        setCounts(counts);

        const userMap = users.reduce((acc: { [key: string]: string }, user: { id: string; nickname: string }) => {
          acc[user.id] = user.nickname;
          return acc;
        }, {});

        setUserMap(userMap);
      }
    };

    fetchPosts();
  }, [query, supabase]);

  return { results, filteredResults, setFilteredResults, counts, userMap };
};

export default useSearchPosts;
