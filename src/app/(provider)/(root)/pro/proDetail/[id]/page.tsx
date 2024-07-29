'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ChatModal from '../../../chat/_components/ChatModal';
import { v4 as uuidv4 } from 'uuid'; // uuid 패키지 import

const supabase = createClient();

const ProDetail = () => {
  const params = useParams();
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [post, setPost] = useState<any>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostData = async (postId: string) => {
      const { data, error } = await supabase
        .from('Request Posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post data:', error.message);
      } else {
        setPost(data);
        setAuthorId(data.user_id);
      }
    };

    if (params?.id) {
      fetchPostData(params.id as string); // params.id를 문자열로 변환
    }
  }, [params?.id]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setCurrentUserId(data.session?.user.id || null);
      }
    };

    fetchSession();
  }, []);

  const handleInquiry = async () => {
    if (!currentUserId || !authorId) {
      console.error('No user logged in or author ID missing');
      return;
    }

    const { data, error } = await supabase
      .from('Chat')
      .select('chat_room_id')
      .or(`consumer_id.eq.${currentUserId},pro_id.eq.${currentUserId}`)
      .or(`consumer_id.eq.${authorId},pro_id.eq.${authorId}`)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      console.error('Error checking chat room:', error.message);
      return;
    }

    if (data) {
      // If chat room already exists
      setChatRoomId(data.chat_room_id);
    } else {
      // Create a new chat room
      const { data: newChatRoom, error: createError } = await supabase
        .from('Chat')
        .insert([
          {
            consumer_id: currentUserId,
            pro_id: authorId,
            content: '새로운 문의를 시작합니다.',
            chat_room_id: uuidv4(), // uuidv4 사용
          },
        ])
        .select('chat_room_id')
        .single();

      if (createError) {
        console.error('Error creating chat room:', createError.message);
        return;
      }

      setChatRoomId(newChatRoom.chat_room_id);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto p-4">
      <div className="flex w-full">
        <div className="w-2/3 h-[500px] bg-yellow-400 mr-[30px]"></div>
        <div className="w-1/3 h-[500px] border-2 border-slate-400 rounded-xl flex flex-col items-center p-4">
          <div className="w-[150px] h-[150px] bg-green-400 rounded-full mt-3"></div>
          <div className="flex my-4 justify-center items-center">
            <p className="ml-5 text-2xl">닉네임</p>
            <div className="w-[20px] h-[20px] bg-gray-400 mx-2"></div>
          </div>
          <div>
            <div className="flex justify-center items-center my-3">
              <div className="w-[20px] h-[20px] bg-gray-400 mr-2"></div>
              <p className="text-lg">연락 가능 시간</p>
            </div>
            <div className="flex justify-center items-center my-3">
              <div className="w-[20px] h-[20px] bg-gray-400 mr-2"></div>
              <p className="text-lg">평균 응답 시간</p>
            </div>
          </div>
          <div className="mt-[20px] flex justify-center items-center max-w-[300px]">
            <p>전문가에 대한 소개글</p>
          </div>
          <div className="flex-grow"></div>
          <div className="flex justify-center items-center mt-auto">
            <button
              className="border-2 border-yellow-400 p-2 w-[170px] bg-yellow-400 rounded-full mx-3"
              onClick={handleInquiry}
            >
              문의하기
            </button>
            <button className="border-2 border-yellow-400 p-2 w-[170px] bg-yellow-400 rounded-full mx-3">
              구매하기
            </button>
          </div>
        </div>
      </div>
      <div className="my-[20px] mx-auto p-4 w-full">
        <ul className="flex">
          <li className="mx-3 text-xl font-bold">포트폴리오</li>
          <li className="mx-3 text-xl font-bold">서비스설명</li>
          <li className="mx-3 text-xl font-bold">리뷰조회</li>
        </ul>
        <div className="flex flex-row flex-wrap justify-start items-start mx-auto mt-[15px]">
          <div className="w-[260px] h-[280px] border-2 border-slate-400 rounded-xl m-5">
            <div className="w-full h-[150px] bg-blue-200 rounded-xl">이미지</div>
            <div className="p-3">
              <p className="text-xl my-2">포트폴리오 제목</p>
              <p className="text-lg mb-2">가격</p>
              <span className="border border-2 border-slate-400 bg-slate-400 rounded-full p-1">개발언어</span>
            </div>
          </div>
          <div className="w-[260px] h-[280px] border-2 border-slate-400 rounded-xl m-5">
            <div className="w-full h-[150px] bg-blue-200 rounded-xl">이미지</div>
            <div className="p-3">
              <p className="text-xl my-2">포트폴리오 제목</p>
              <p className="text-lg mb-2">가격</p>
              <span className="border border-2 border-slate-400 bg-slate-400 rounded-full p-1">개발언어</span>
            </div>
          </div>
          <div className="w-[260px] h-[280px] border-2 border-slate-400 rounded-xl m-5">
            <div className="w-full h-[150px] bg-blue-200 rounded-xl">이미지</div>
            <div className="p-3">
              <p className="text-xl my-2">포트폴리오 제목</p>
              <p className="text-lg mb-2">가격</p>
              <span className="border border-2 border-slate-400 bg-slate-400 rounded-full p-1">개발언어</span>
            </div>
          </div>
        </div>
      </div>
      {chatRoomId && <ChatModal chatRoomId={chatRoomId} onClose={() => setChatRoomId(null)} />}
    </div>
  );
};

export default ProDetail;
