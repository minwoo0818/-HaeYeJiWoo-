// MUI(Material UI) 컴포넌트 및 React 관련 라이브러리 import
import { Button, TextField, Typography } from "@mui/material"; // UI 요소들
import { Box, Stack } from "@mui/system"; // 레이아웃 구성용
import type React from "react"; // 타입 지정용
import { useState } from "react"; // 상태 관리 훅
import { useNavigate } from "react-router-dom"; // 페이지 이동 훅

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

  // 이메일 형식 유효성 검사 함수
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  // 비밀번호 유효성 검사
  const isValidPassword = (password: string) => {
    const lengthValid = password.length >= 8 && password.length <= 12;
    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthValid && hasNumber && hasLetter && hasSpecial;
  };
  // 닉네임 길이제한
  const isValidNickname = (nickname: string) => {
    return nickname.length <= 10;
  };

  // 닉네임 또는 이메일 중복 체크 함수
  const checkDuplicate = async (field: "email" | "nickname") => {
    const value = form[field].trim(); // 입력값 앞뒤 공백 제거

    // 입력값이 비어있을 경우 경고
    if (!value) {
      alert(`${field === "email" ? "이메일" : "닉네임"}을 입력해주세요.`);
      return;
    }

    // 이메일 형식이 잘못된 경우 경고
    if (field === "email" && !isValidEmail(value)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (field === "nickname" && !isValidNickname(value)) {
      alert("닉네임은 10자까지 가능합니다.");
      return;
    }

    // 중복 체크 API 요청 URL 생성
    const url = `${BASE_URL}/users/check${
      field === "email" ? "Email" : "Nickname"
    }?value=${value}`;
    console.log("중복체크 요청 URL:", url);

    try {
      const res = await fetch(url); // API 요청
      const data = await res.text(); // 응답 텍스트 추출
      alert(data); // 결과 알림창으로 표시
    } catch (err) {
      console.error("중복체크 에러:", err);
      alert("중복체크 요청 실패");
    }
  };

  // 회원가입 요청 함수
  const handleSubmit = async () => {
    const { email, password, nickname } = form;
    const missingFields: string[] = [];

    // 필수 입력값 누락 확인
    if (!nickname.trim()) missingFields.push("닉네임");
    if (!email.trim()) missingFields.push("이메일");
    if (!password.trim()) missingFields.push("비밀번호");

    // 누락된 항목이 있을 경우 경고
    if (missingFields.length > 0) {
      alert(`${missingFields.join(", ")}을(를) 입력해주세요.`);
      return;
    }

    // 이메일 형식 검사
    if (!isValidEmail(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    // 패스워드 형식 검사
    if (!isValidPassword(password)) {
      alert(
        "비밀번호는 8~12자이며 숫자, 문자, 특수문자를 모두 포함해야 합니다."
      );
      return;
    }

    if (!isValidNickname(nickname)) {
      alert("닉네임은 10자까지 가능합니다.");
      return;
    }

    try {
      // 회원가입 API 요청
      const res = await fetch(`${BASE_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          hashedPassword: password,
          userNickname: nickname,
        }),
      });

      // 요청 성공 시 로그인 페이지로 이동
      if (res.ok) {
        alert("회원가입 성공!");
        navigate("/login");
      } else {
        const msg = await res.text();
        alert(msg); // 실패 메시지 표시
      }
    } catch (err) {
      console.error("회원가입 에러:", err);
      alert("회원가입 요청 실패");
    }
  };

  // 화면 렌더링
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
            helperText="닉네임은 10자까지 가능합니다."
          />

          <Button
            variant="outlined"
            size="small"
            sx={{
              whiteSpace: "nowrap",
              minWidth: "60px",
              height: "57px",
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
        {/* 비밀번호 조건 안내 */}
        <Typography variant="caption" color="textSecondary">
          비밀번호는 8~12자이며 숫자, 문자, 특수문자를 모두 포함해야 합니다.
        </Typography>

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
