"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function ProDetail() {
  const [post, setPost] = useState([]);
  const { id } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/proDetail?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPost(data.data);
      } catch (error) {
        console.error('Fetch data error:', error);
      }
    };

    fetchData();
  }, [id]);


  console.log('post =>',post);
  return (
    <div className="max-w-[1280px] mx-auto p-4">
      <div className="flex flex-row justify-between">
        <div className="h-[514px] w-[390px] border-2 rounded-xl">
        </div>
        <div className="h-[514px] w-[810px] border-2 rounded-xl">
          <img src={post.post_img[0]} alt="post_image" className="h-full w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}