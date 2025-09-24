// React 및 필요한 라이브러리 import
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";

// 환경 변수에서 API 기본 URL 가져오기
const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  // 로그인 폼 상태 관리: 이메일과 비밀번호
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 페이지 이동을 위한 navigate 훅
  const navigate = useNavigate();

  // 입력값 변경 시 상태 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 로그인 버튼 클릭 시 실행되는 함수
  const handleSubmit = async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST", // POST 요청으로 로그인 시도
      headers: { "Content-Type": "application/json" }, // JSON 형식으로 전송
      body: JSON.stringify(form), // 폼 데이터를 문자열로 변환
    });

    if (res.ok) {
      // 로그인 성공 시 알림 후 페이지 이동
      alert("로그인 성공!");
      navigate("/category/all"); // 로그인 후 카테고리 페이지로 이동
    } else {
      // 로그인 실패 시 서버에서 받은 메시지 출력
      const msg = await res.text();
      alert(msg);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={2} width={330}>
        {/* 로그인 제목 */}
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
          로그인
        </Typography>

        {/* 환영 메시지 */}
        <Typography align="center">
          HYJW 멤버 커뮤니티에 오신 것을 환영합니다.
        </Typography>

        {/* 이메일 입력 필드 */}
        <TextField
          label="이메일"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        {/* 비밀번호 입력 필드 */}
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {/* 로그인 버튼 */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#474747",
            "&:hover": { backgroundColor: "#333" },
            padding: "10px 20px",
            fontSize: "1.25rem",
            fontWeight: "bold",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          로그인
        </Button>

        {/* 회원가입 링크 */}
        <Typography variant="body2" align="center">
          아직 HaYeJiWoo Member가 아니신가요?{" "}
          <span
            style={{
              color: "#0961baff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/signup")} // 회원가입 페이지로 이동
          >
            회원가입
          </span>
        </Typography>
      </Stack>
    </Box>
  );
};

export default Login;
