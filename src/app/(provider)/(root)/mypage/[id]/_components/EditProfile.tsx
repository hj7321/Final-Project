interface EditProfileProps {
  clickModal: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ clickModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6  w-[886px] h-[712px] relative">
        <h1 className="text-2xl font-bold mb-4">프로필 수정 페이지입니다</h1>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={clickModal}>
          x
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
