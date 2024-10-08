import Marketing from './Marketing';
import PersonalInfo from './PersonalInfo';
import TermsOfService from './TermsOfService';

interface ModalProps {
  onClose: () => void;
  modalNum: number;
}

const modalTitle = ['서비스 이용약관', '개인정보 수집 및 이용 동의', '마케팅 수신 동의'];

export default function Modal({ onClose, modalNum }: ModalProps) {
  return (
    <section className="fixed inset-0 flex justify-center items-center text-left bg-grey-300 bg-opacity-50 z-50">
      <div className="w-4/5 h-4/5 md:w-[664px] md:h-[646px] relative bg-white rounded-[16px] p-[32px] flex flex-col items-center">
        <button onClick={onClose} className="absolute top-[-1px] right-[10px] text-[25px]">
          &times;
        </button>
        <h1 className="w-[296px] md:w-[600px] h-[30px] mb-[32px] text-[20px] text-center font-bold">
          {modalTitle[modalNum]}
        </h1>
        <div className="w-6/7 h-5/7 md:w-[600px] md:h-[520px] bg-grey-50 p-[32px] overflow-y-auto text-[12px]">
          {modalNum === 0 ? <TermsOfService /> : modalNum === 1 ? <PersonalInfo /> : <Marketing />}
        </div>
      </div>
    </section>
  );
}
