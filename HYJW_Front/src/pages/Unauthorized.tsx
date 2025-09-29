import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>접근 권한이 없습니다.</h1>
      <p>이 페이지는 관리자만 접근할 수 있습니다.</p>
      <button onClick={handleConfirm} style={{ marginTop: '20px', padding: '10px 20px' }}>
        확인
      </button>
    </div>
  );
};

export default Unauthorized;
