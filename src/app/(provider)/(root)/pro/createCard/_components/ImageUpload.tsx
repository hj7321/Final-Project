import { CODEUSVG } from "@/components/dumy"

interface ImageUploadProps {
  images : File[]
  handleImageChange : (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImageDelete : (index: number) => void
}

export default function ImageUpload({images, handleImageDelete, handleImageChange} : ImageUploadProps) {
  return (
    <div className="w-full border-2 border-slate-400 my-[20px] rounded-md p-4">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-wrap mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-[100px] h-[100px] mr-2 mb-2">
              <img
                src={URL.createObjectURL(image)}
                alt={`preview ${index}`}
                className="w-full h-full object-cover rounded-md cursor-pointer"
                onClick={() => handleImageDelete(index)}
              />
            </div>
          ))}
        </div>
        {images.length < 1 && (
          <label 
            className="w-[60px] h-[60px] bg-gray-100 flex items-center justify-center relative rounded-full mt-4 cursor-pointer"
          >
            <img src={CODEUSVG} alt="" className="w-[36px] h-[36px] " />
            <input
              type="file"
              multiple
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              onChange={handleImageChange}
            />
          </label>
        )}
        <label className="my-4 underline underline-offset-4 text-blue-600 cursor-pointer">
          이미지를 첨부해주세요. (1개 이상 필수, 최대 5개까지 첨부 가능)
          <input type="file" multiple className="hidden" onChange={handleImageChange} />
        </label>
      </div>
    </div>
  )
}