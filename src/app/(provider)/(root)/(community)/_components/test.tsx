// Comment.tsx
"use client";
import { createClient } from "@/supabase/client";
import { Comments } from "@/types/type";
import { useAuthStore } from "@/zustand/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Notify } from "notiflix";
import { useRef } from "react";
import GetComments from "./GetComments";
// type CommentsData = Omit<Comments, "id" | "created_at">;


export default function Comment() {
  const user = useAuthStore((state) => state.user);
  const params = useParams();
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // 여기부터 
  const getProfileDate = async () => {
    if (user) {
      const supabase = createClient();
      const data = await supabase.from("profile").select("*").eq("id", user.id).maybeSingle();
      return data;
    }
  };


  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: getProfileDate,
  });
// 여기까지는 아마 유저를 등록하는 로직인 것 같음

  const saveComment = async (data: CommentsData) => {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };


  const { mutate: addMutation } = useMutation<Comments, unknown, CommentsData>({
    mutationFn: (data: CommentsData) => saveComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      if (contentRef.current) {
        contentRef.current.value = "";
        Notify.success("댓글 작성이 완료되었습니다.");
      }
    },
  });


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user === null) {
      Notify.failure("로그인 시 댓글 작성 가능합니다.");
      return;
    }
    if (!contentRef.current?.value.trim()) {
      Notify.failure("댓글 내용을 입력해주세요.");
      return;
    }
    if (profile !== undefined) {
      const commentsData: CommentsData = {
        nickname: profile?.data?.nickname as string,
        user_id: user?.user_metadata.sub,
        content: contentRef.current?.value || "",
        post_id: params.id as string,
      };
      addMutation(commentsData);
    }
  };


  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };


  return (
    <div className="bg-[#F5F5F5] pt-[20px] pb-[100px] px-[15px] lg:px-0 ">
      <div className="max-w-4xl mx-auto bg-white p-[15px] rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">댓글</h2>
        <form onSubmit={onSubmit} className="mb-4 flex">
          <textarea
            ref={contentRef}
            className="w-[90%] p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Write a comment..."
            onKeyDown={onKeyDown}
          ></textarea>
          <button className="w-[10%] min-w-[80px] bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
            작성
          </button>
        </form>
        <GetComments />
      </div>
    </div>
  );
}
5:53
//GetC