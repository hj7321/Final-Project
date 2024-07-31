// 'use client'

// import { CommunityPosts } from '@/types/type';
// import { createClient } from '@/utils/supabase/client';
// import useAuthStore from '@/zustand/authStore';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { useRouter } from 'next/router';
// import { useEffect, useRef, useState } from 'react';

// export default function CreatePost() {
//   const categoryRef = useRef<HTMLSelectElement>(null);
//   const postCategoryRef = useRef<HTMLInputElement>(null);
//   const titleRef = useRef<HTMLInputElement>(null);
//   const langCategory = useRef<HTMLInputElement>(null);
//   const userRef = useRef<HTMLInputElement>(null);
//   const contentRef = useRef<HTMLTextAreaElement>(null);

//   const [file, setFile] = useState<File | null>(null);
//   const [imgUrl, setImgUrl] = useState<string | null>('');
//   const user = useAuthStore((state) => state.Users);
//   const router = useRouter();
//   const { id } = useParams();

//   const getProfileDate = async () => {
//     if (user) {
//       const supabase = createClient();
//       const data = await supabase.from('Users').select('*').eq('id', user.id).maybeSingle();
//       return data;
//     }
//   };
//   const { data: users } = useQuery({
//     queryKey: ['users', user?.id],
//     queryFn: getProfileDate
//   });

//   const getPostData = async () => {
//     const response = await fetch('/api/post');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data: CommunityPosts[] = await response.json();
//     const post: CommunityPosts | undefined = data.find((post) => post.id === id);
//     if (!post) {
//       return;
//     }
//     if (titleRef.current) titleRef.current.value = post.title;
//     if (postCategoryRef.current) postCategoryRef.current.value = post.post_category;
//     if (contentRef.current) contentRef.current.value = post.content;
//     if (langCategory.current) langCategory.current.value = post.lang_category;
//     if (userRef.current) userRef.current.value = users?.data?.nickname as string;

//     setImgUrl(post.post_img);
//   };

//   useEffect(() => {
//     if (id !== 'new') {
//       getPostData();
//     }
//   }, [id]);

//   const savePost = async (data: TPostData) => {
//     const response = await fetch('/api/post', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     return response.json();
//   };

//   const editPost = async (data: TPostData) => {
//     const response = await fetch('/api/post', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     return response.json();
//   };

//   const { mutate: saveMutation } = useMutation<CommunityPosts, unknown, TPostData>({
//     mutationFn: (data: TPostData) => (id === 'new' ? savePost(data) : editPost(data))
//   });

//   const uploadImg = async (): Promise<string | null> => {
//     if (!file) {
//       return imgUrl;
//     }
//     const newFileName = uuidv4();
//     const supabase = createClient();
//     const { data, error } = await supabase.storage.from('post').upload(`${newFileName}`, file);
//     if (error) {
//         alert(`파일이 업로드 되지 않습니다.${error}`)
//         return null;
//     }
//     const res = await supabase.storage.from('post').getPublicUrl(data.path);
//     return res.data.publicUrl;
//   };

//   const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const img_url = (await uploadImg()) || '';
//     const postData: TPostData = {
//       category: categoryRef.current?.value || '',
//       lang_category: langCategory.current?.value || '',
//       post_category: postCategoryRef.current?.value || '',
//       content: contentRef.current?.value || '',
//       img_url: img_url,
//       user_nickname: users?.data?.nickname || '',
//       user_id: user?.id as string,
//       id: id === 'new' ? uuidv4() : (id as string)
//     };

//     if (
//       !postData.category ||
//       !postData.store_name ||
//       !postData.menu_name ||
//       !postData.order_date ||
//       !postData.address ||
//       !postData.rating ||
//       !postData.content ||
//       !postData.img_url
//     ) {
//       alert('빈칸을 채워주세요!');
//       return;
//     }
//     saveMutation(postData);
//     alert('작성이 완료되었습니다.');
//     router.push('/');
//   };

//   return (
//     <>
//       <div className="max-w-[1024px] mx-auto my-20">
//         <h1 className="text-center mt-10 mb-3 text-2xl font-bold">오늘의 식당 기록</h1>
//         <h3 className="text-center mb-10 text-lg">식당과 메뉴를 공유해주세요!</h3>

//         <form className="w-full pt-[40px] pb-[100px] px-[15px] lg:px-[140px] shadow-lg" onSubmit={handlePostSubmit}>
//           <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-8">
//             <div className="flex items-center">
//               <label className="w-[80px] sm:w-[120px] font-bold">유형</label>
//               <select className="p-2 border rounded-md" ref={categoryRef}>
//                 <option value="방문">방문</option>
//                 <option value="배달">배달</option>
//               </select>
//             </div>

//             <div className="flex items-center">
//               <label className="w-[80px] sm:w-[120px] font-bold">식당이름</label>
//               <input className="p-2 border rounded-md" type="text" ref={storeRef} />
//             </div>
//             <div className="flex items-center">
//               <label className="w-[80px] sm:w-[120px] font-bold">메뉴이름</label>
//               <input className="p-2 border rounded-md" type="text" ref={menuRef} />
//             </div>
//             <div className="flex items-center">
//               <label className="w-[80px] sm:w-[120px] font-bold">주문날짜</label>
//               <input className="p-2 border rounded-md" type="date" ref={orderDateRef} />
//             </div>
//             <div className="flex items-center">
//               <label className="w-[80px] sm:w-[120px] font-bold">작성자</label>
//               <input
//                 className="p-2 border rounded-md"
//                 type="text"
//                 ref={userRef}
//                 defaultValue={users?.data?.nickname}
//               />
//             </div>
//             <div className="flex items-center">
//               <label className="w-[80px] sm:w-[120px] font-bold">주소</label>
//               <input className="p-2 border rounded-md" placeholder="OO시 OO구 OO동" type="text" ref={addressRef} />
//             </div>
//           </div>
//           <ProductsImage setFile={setFile} />
//           <div className="mt-5">
//             <textarea
//               className="w-full h-[400px] p-5 border rounded-md resize-none"
//               name="text"
//               placeholder="내용을 입력해주세요."
//               ref={contentRef}
//             ></textarea>
//           </div>

//           <div className="mt-5 text-right space-x-2">
//             <button className="rounded py-2 px-4 bg-gray-400 border-gray-400 text-center text-white font-bold">
//               <Link href={'/'}>뒤로가기</Link>
//             </button>
//             <button>{id === 'new' ? '작성하기' : '수정완료'}</button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }
// function uuidv4() {
//     throw new Error('Function not implemented.');
// }
