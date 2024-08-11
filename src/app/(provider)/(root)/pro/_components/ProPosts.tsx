"use client"

import Image from "next/image"
import Link from "next/link"
import { Posts } from "../page"

interface ProPostsProps {
  filteredPosts : Posts[]
  getCategoryImage : (categoryName : string) => string
}

export default function ProPosts({filteredPosts, getCategoryImage} : ProPostsProps) {
  return (
    filteredPosts.map((post:Posts) => (
      <Link href={`pro/proDetail/${post.id}`} key={post.id} className="grid grid-cols-1 mx-auto">
        <div className="lg:w-[300px] lg:h-[300px] w-[160px] h-[240px] rounded-lg xl:m-[30px] border border-grey-50 m-[10px] hover:scale-105 md:hover:scale-110 transition-transform duration-200">
          {post.post_img && post.post_img.length > 0 && (
            <Image
              className="md:w-[280px] w-[140px] xl:h-[160px] h-[130px] rounded-lg object-cover mt-2 mx-auto"
              src={post.post_img[0]}
              width={300}
              height={160}
              priority
              alt={post.title}
            />
          )}
          <div className="flex flex-col  p-2 h-[140px]">
            <div>
              <div className="flex flex-row">
                <p className="text-sm lg:mb-2 lg:mr-3 flex">
                  <Image
                    src={getCategoryImage(post.lang_category[0])}
                    alt={post.lang_category[0]}
                    width={20}
                    height={20}
                    priority
                    className="mr-2 w-[16px] h-[16px] lg:w-[20px] lg:h-[20px]"
                  />
                  <span className="text-xs text-grey-600 lg:text-sm">{post.lang_category[0]}</span>
                </p>
              </div>
              <p className="text-xs lg:text-sm mt-2 min-h-[32px] md:min-h-[40px] line-clamp-2">{post.title}</p>
              
            </div>
            <p className="md:text-xl text-sm mt-1 lg:mt-2 font">{post.price}원</p>
          </div>
        </div>
      </Link>
    ))
  )
}