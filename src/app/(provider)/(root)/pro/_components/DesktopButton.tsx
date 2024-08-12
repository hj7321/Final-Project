"use client"

interface DesktopButtonProps {
  handleNavigation : () => void
}

export default function DesktopButton({ handleNavigation } : DesktopButtonProps) {
  return (
    <button
      className="md:ml-[85%] bg-primary-500 hover:bg-primary-600 md:px-5 md:py-3 md:mt-3 md:mr-[0px] px-3 py-2 mt-1 mr-4 flex flex-row justify-center items-center rounded-full"
      onClick={handleNavigation}
    >
      <div className="md:w-[24px] md:h-[24px] w-[16px] h-[16px]">
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.2536 6.47487L9.77877 8.94975L5.17441 13.5541C4.95175 13.7768 4.81748 14.0727 4.79653 14.3869L4.5743 17.7204C4.52198 18.5052 5.1731 19.1563 5.95789 19.104L9.29139 18.8817C9.60559 18.8608 9.9015 18.7265 10.1242 18.5039L14.7285 13.8995L17.2034 11.4246M12.2536 6.47487L13.8093 4.91924C14.317 4.41156 15.1401 4.41156 15.6478 4.91924L18.759 8.03051C19.2667 8.53819 19.2667 9.3613 18.759 9.86899L17.2034 11.4246M12.2536 6.47487L17.2034 11.4246"
            stroke="white"
          />
          <path
            d="M18.759 8.03051L15.6478 4.91924C15.1401 4.41156 14.317 4.41156 13.8093 4.91924L13.1729 5.55563C12.6652 6.06332 12.6652 6.88643 13.1729 7.39411L16.2842 10.5054C16.7918 11.0131 17.6149 11.0131 18.1226 10.5054L18.759 9.86899C19.2667 9.3613 19.2667 8.53819 18.759 8.03051Z"
            fill="white"
            stroke="white"
          />
        </svg>
      </div>
      <div className="text-white mx-[2px] md:text-base text-[12px]">홍보하기</div>
    </button>
  );
}
