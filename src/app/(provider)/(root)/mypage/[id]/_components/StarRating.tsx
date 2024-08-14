import React, { useState } from 'react';

type StarRatingProps = {
  totalStars?: number;
  size?: number; // 별의 크기
  selectedStars?: number; // 선택된 별의 수
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean; // 별점 변경 가능 여부
};

const StarRating: React.FC<StarRatingProps> = ({
  totalStars = 5,
  size = 24,
  selectedStars = 0,
  onRatingChange,
  readOnly = false
}) => {
  const [rating, setRating] = useState(selectedStars);
  const [hover, setHover] = useState(0);

  const handleClick = (index: number) => {
    if (!readOnly) {
      setRating(index);
      if (onRatingChange) {
        onRatingChange(index);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {Array.from({ length: totalStars }, (_, index) => (
        <svg
          key={index}
          onClick={() => handleClick(index + 1)}
          onMouseEnter={() => (readOnly ? null : setHover(index + 1))}
          onMouseLeave={() => (readOnly ? null : setHover(0))}
          xmlns="http://www.w3.org/2000/svg"
          fill={index < (hover || rating) ? 'gold' : 'lightgray'}
          viewBox="0 0 24 24"
          stroke={index < (hover || rating) ? 'gold' : 'lightgray'}
          width={size} // 크기 설정
          height={size} // 크기 설정
          style={{ cursor: readOnly ? 'default' : 'pointer', marginRight: '5px' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
