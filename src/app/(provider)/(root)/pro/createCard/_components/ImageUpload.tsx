
interface ImageUploadProps {
  images: File[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageDelete: (index: number) => void;
}

export default function ImageUpload({ images, handleImageDelete, handleImageChange }: ImageUploadProps) {
  return (
    <div className="w-full border-2 border-slate-400 my-[20px] rounded-md md:p-4 p-2">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-wrap md:mt-4 mt-2">
          {images.map((image, index) => (
            <div key={index} className="relative md:w-[100px] md:h-[100px] w-[50px] h-[50px] mr-2 mb-2">
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
          <label className="md:w-[60px] md:h-[60px] w-[40px] h-[40px] bg-gray-100 flex items-center justify-center relative rounded-full md:mt-4 cursor-pointer">
            <svg width="full" height="full" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.125 23.396L11.7993 16.9724C12.359 16.2785 13.3969 16.2231 14.0274 16.8535L16.8737 19.6996C17.4693 20.2951 18.4384 20.2837 19.0197 19.6742L23.4805 14.9976C24.1205 14.3266 25.2099 14.3913 25.7661 15.1332L30.0034 20.7855M9.125 29.9999H27.0034C28.6603 29.9999 30.0034 28.6567 30.0034 26.9999V8.3125C30.0034 6.65565 28.6603 5.3125 27.0034 5.3125H9.125C7.46815 5.3125 6.125 6.65565 6.125 8.3125V26.9999C6.125 28.6567 7.46815 29.9999 9.125 29.9999Z"
                stroke="#9FA8B2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="file"
              multiple
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              onChange={handleImageChange}
            />
          </label>
        )}
        <label className="md:my-4 my-3 underline underline-offset-4 text-blue-600 cursor-pointer md:text-base text-xs">
          이미지를 첨부해주세요. (1개 이상 필수, 최대 5개까지 첨부 가능)
          <input type="file" multiple className="hidden" onChange={handleImageChange} />
        </label>
      </div>
    </div>
  );
}
