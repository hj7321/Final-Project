interface PriceInputProps {
  price : number | ""
  setPrice : (price : number | "") => void
}

export default function PriceInput({price, setPrice} : PriceInputProps) {
  return (
    <div className="mb-[20px]">
      <input
        type="number"
        className="w-full border-2 md:p-4 p-3 rounded-md border-slate-400 md:text-base text-sm"
        placeholder="금액을 입력해주세요. (VAT 포함)"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
      />
    </div>
  );
}