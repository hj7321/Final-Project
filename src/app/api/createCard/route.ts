
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const uploadImageAndGetUrl = async (supabase: any, image: File) => {
  const fileExt = image.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: storageError } = await supabase.storage.from('request_post_image').upload(filePath, image);
  if (storageError) {
    throw new Error('스토리지 업로드 실패');
  }

  const { data } = await supabase.storage.from('request_post_image').getPublicUrl(filePath);
  if (!data.publicUrl) {
    throw new Error('URL 가져오기 실패');
  }
  return data.publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const language = JSON.parse(formData.get('language') as string);
    const images = formData.getAll('images') as File[];
    const price = parseFloat(formData.get('price') as string);

    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }

    const supabase = createClient();
    const uploadedImageUrls = await Promise.all(images.map(image => uploadImageAndGetUrl(supabase, image)));

    const { data, error } = await supabase.from('Request Posts').insert([
      {
        user_id: userId,
        title,
        content: description,
        lang_category: language,
        price: price,
        post_img: uploadedImageUrls
      }
    ]).select('id').single();

    if (error) {
      throw new Error('데이터베이스 삽입 실패');
    }

    return NextResponse.json({ id: data.id, message: '게시글이 작성되었습니다!' });
  } catch (error) {
    console.error('오류 발생', error);
    return NextResponse.json({ error: '오류가 발생했습니다' }, { status: 500 });
  }
}