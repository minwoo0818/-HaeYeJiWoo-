// MUI 컴포넌트 및 React 관련 라이브러리 import
import { Button, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 환경 변수에서 API 기본 URL 가져오기
const BASE_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
  // 회원가입 폼 상태 관리: 닉네임, 이메일, 비밀번호
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
  });

  // 페이지 이동을 위한 navigate 훅
  const navigate = useNavigate();

  // 입력값 변경 시 상태 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkDuplicate = async (field: "email" | "nickname") => {
    const value = form[field].trim();

    // 공백 검사
    if (!value) {
      alert(`${field === "email" ? "이메일" : "닉네임"}을 입력해주세요.`);
      return;
    }

    // 이메일 형식 검사
    if (field === "email" && !isValidEmail(value)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    const url = `${BASE_URL}/check${
      field === "email" ? "Email" : "Nickname"
    }?value=${value}`;
    console.log("중복체크 요청 URL:", url);

    try {
      const res = await fetch(url);
      const data = await res.text();
      alert(data);
    } catch (err) {
      console.error("중복체크 에러:", err);
      alert("중복체크 요청 실패");
    }
  };

  // 회원가입 요청 함수
  const handleSubmit = async () => {
    const { email, password, nickname } = form;
    const missingFields: string[] = [];

    if (!nickname.trim()) missingFields.push("닉네임");
    if (!email.trim()) missingFields.push("이메일");
    if (!password.trim()) missingFields.push("비밀번호");

    if (missingFields.length > 0) {
      alert(`${missingFields.join(", ")}을(를) 입력해주세요.`);
      return;
    }

    if (!isValidEmail(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          hashedPassword: password,
          userNickname: nickname,
        }),
      });

      if (res.ok) {
        alert("회원가입 성공!");
        navigate("/login");
      } else {
        const msg = await res.text();
        alert(msg);
      }
    } catch (err) {
      console.error("회원가입 에러:", err);
      alert("회원가입 요청 실패");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh", // 화면 전체 높이
        display: "flex", // Flexbox 사용
        justifyContent: "center", // 가로 중앙 정렬
        alignItems: "center", // 세로 중앙 정렬
      }}
    >
      <Stack spacing={2} width={330}>
        {/* 회원가입 제목 */}
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
          회원가입
        </Typography>

        {/* 닉네임 입력 필드 + 중복체크 버튼 */}
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            label="닉네임"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{
              whiteSpace: "nowrap",
              minWidth: "60px",
              padding: "4px 6px",
              fontSize: "0.75rem",
            }}
            onClick={() => checkDuplicate("nickname")} // 닉네임 중복 체크
          >
            중복체크
          </Button>
        </Box>

        {/* 이메일 입력 필드 + 중복체크 버튼 */}
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            label="이메일"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{
              whiteSpace: "nowrap",
              minWidth: "60px",
              padding: "4px 6px",
              fontSize: "0.75rem",
            }}
            onClick={() => checkDuplicate("email")} // 이메일 중복 체크
          >
            중복체크
          </Button>
        </Box>

        {/* 비밀번호 입력 필드 */}
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {/* 회원가입 버튼 */}
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
          회원가입
        </Button>

        {/* 로그인 페이지로 이동 버튼 */}
        <Button
          onClick={() => navigate("/login")}
          sx={{ color: "#0961baff", textDecoration: "underline" }}
        >
          로그인으로 가기
        </Button>
      </Stack>
    </Box>
  );
};

export default SignUp;
