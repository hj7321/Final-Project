export default function CreateCard() {
  return (
    <div className="max-w-[1240px] mx-auto my-6">
      <h1 className="mb-[20px] text-2xl">전문가 의뢰 등록하기</h1>
      <div className="mb-[20px]">
        <input
          type="text"
          className="w-full border-2 p-4 rounded-md border-slate-400"
          placeholder="제목을 입력해주세요."
        />
      </div>
      <div className="mb-[20px] border-2 border-slate-400 rounded-md">
        <div className="p-4">
          <p className="ml-7 text-lg">언어 선택(중복가능)</p>
          <div className="flex flex-row px-4 flex-wrap items-center">
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">HTML/CSS</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">JavaScript</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">Java</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">Python</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">C / C++ / C#</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">TypeScript</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">React</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">Android / IOS</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">Next.JS</p>
            </div>
            <div className="flex justify-start items-center mx-5 my-3 w-[150px]">
              <input
                type="checkbox"
                name="html_css"
                id=""
                className="w-5 h-5 appearance-none border-2 border-black-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
              />
              <p className="ml-2">Git / Github</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[150px] border-2 border-slate-400 my-[20px] rounded-md p-4 flex flex-col items-center justify-center">
        <div className="w-[60px] h-[60px] bg-blue-300 flex items-center justify-center relative rounded-full">
          이미지
          <input type="file" multiple className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
        </div>
        <p className="mt-4">이미지를 첨부해주세요. (1개 이상 필수, 최대 5개까지 첨부 가능)</p>
      </div>

      <div className="border-2 border-slate-400 mb-[20px] rounded-md">
        <textarea name="text" id="text" cols="30" rows="10" className="w-full h-[500px] p-5"></textarea>
      </div>
      <button className="w-full p-5 border-2 border-slate-400 rounded-md">등록하기</button>
    </div>
  );
}
