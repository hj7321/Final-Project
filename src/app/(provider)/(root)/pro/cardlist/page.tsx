export default function CardlistPage() {
  return (
    <div>
      {/* 언어별 카테고리 영역 */}
      <div className="bg-zinc-500 h-32 w-[900px] mx-auto" >
        <ul className="flex justify-between mx-5 ">
          <li>HTML/CSS</li>
          <li>JavaScript</li>
          <li>Java</li>
          <li>Python</li>
          <li>C/C#/C++</li>
          <li>Android/IOS APP</li>
          <li>Git/Github</li>
        </ul>
      </div>

      {/* 경력 버튼 필터링 영역 */}
      <div className="h-32 bg-red-400 w-[500px] mx-auto flex justify-between px-[20px]">
        <button> 1 ~ 2년 </button>
        <button> 3 ~ 4년 </button>
        <button> 4 ~ 5년 </button>
        <button> 5 ~ 6년 </button>
        <button> 7년 이상 </button>
      </div>

      {/* 의뢰 서비스 리스트 */}
      <div className="bg-blue-400 w-[1600px] mx-auto flex flex-row flex-wrap">
        <div className="w-[300px] h-[400px] border-4 border-black m-[10px]">
          상품
        </div>
        <div className="w-[300px] h-[400px] border-4 border-black m-[10px]">
          상품
        </div>
        <div className="w-[300px] h-[400px] border-4 border-black m-[10px]">
          상품
        </div>
        <div className="w-[300px] h-[400px] border-4 border-black m-[10px]">
          상품
        </div>
        <div className="w-[300px] h-[400px] border-4 border-black m-[10px]">
          상품
        </div>
        <div className="w-[300px] h-[400px] border-4 border-black m-[10px]">
          상품
        </div>
        <div className="w-[300px] h-[400px] border-4 border-black m-[10px]">
          상품
        </div>
        <div className="w-[300px] h-[400px] border-4 border-black m-[10px]">
          상품
        </div>
        
      </div>

    </div>
  )
}
