"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface BookmarkCountProps {
	postId: string;
}

export const BookmarkCount = ({ postId }: BookmarkCountProps) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["bookmark", "count", postId],
		queryFn: async () => {
			const { count } = await fetch(`/api/bookmarkCount?postId=${postId}`).then((res) => res.json());
			return count;
		}
	})

	return (
		<span className="text-gray-500 text-[14px]">
			{' '}
			like:{data}
		</span>
	)
}