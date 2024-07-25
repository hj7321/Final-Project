import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CommunityPosts, RequestPosts } from '@/types/type';

type CombinedPost = (CommunityPosts & { category: 'Community' }) | (RequestPosts & { category: 'Request' });

const useSearchPosts = (query: string) => {
  const [results, setResults] = useState<CombinedPost[]>([]);
  const [filteredResults, setFilteredResults] = useState<CombinedPost[]>([]);
  const [counts, setCounts] = useState({ total: 0, qna: 0, insight: 0, request: 0 });
  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const [communityPostsResponse, requestPostsResponse] = await Promise.all([
        supabase.from('Community Posts').select('*'),
        supabase.from('Request Posts').select('*')
      ]);

      const communityPosts = communityPostsResponse.data as CommunityPosts[];
      const requestPosts = requestPostsResponse.data as RequestPosts[];

      if (communityPostsResponse.error) {
        console.error('Community Posts error:', communityPostsResponse.error.message);
      }
      if (requestPostsResponse.error) {
        console.error('Request Posts error:', requestPostsResponse.error.message);
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
          insight: filteredResults.filter((item) => item.category === 'Community' && item.post_category === 'Insight').length,
          request: filteredResults.filter((item) => item.category === 'Request').length,
        };

        setResults(filteredResults);
        setFilteredResults(filteredResults);
        setCounts(counts);
      }
    };

    fetchPosts();
  }, [query]);

  return { results, filteredResults, setFilteredResults, counts };
};

export default useSearchPosts;
