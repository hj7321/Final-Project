import { useRouter } from "next/navigation"

export default function PageBackBtn() {
  const router = useRouter()
  return (
    <div className="w-[60px] h-[60px] md:w-[120px] md:h-[120px]">
    <button onClick={() => router.push('/pro')}>
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16.25" y="16.25" width="31.5" height="31.5" rx="15.75" stroke="#9FA8B2" strokeWidth="0.5" />
        <path
          d="M36 31.75C36.1381 31.75 36.25 31.8619 36.25 32C36.25 32.1381 36.1381 32.25 36 32.25V31.75ZM27.8232 32.1768C27.7256 32.0791 27.7256 31.9209 27.8232 31.8232L29.4142 30.2322C29.5118 30.1346 29.6701 30.1346 29.7678 30.2322C29.8654 30.3299 29.8654 30.4882 29.7678 30.5858L28.3536 32L29.7678 33.4142C29.8654 33.5118 29.8654 33.6701 29.7678 33.7678C29.6701 33.8654 29.5118 33.8654 29.4142 33.7678L27.8232 32.1768ZM36 32.25H28V31.75H36V32.25Z"
          fill="#828F9B"
        />
      </svg>
    </button>
  </div>
  )
}