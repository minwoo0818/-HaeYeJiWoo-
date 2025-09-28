import { Button, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkDuplicate, signUp } from "../api/SignUpApi";

const BASE_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const lengthValid = password.length >= 8 && password.length <= 12;
    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthValid && hasNumber && hasLetter && hasSpecial;
  };

  const isValidNickname = (nickname: string) => {
    return nickname.length <= 10;
  };

  const handleDuplicateCheck = async (field: "email" | "nickname") => {
    const value = form[field].trim();

    if (!value) {
      alert(`${field === "email" ? "이메일" : "닉네임"}을 입력해주세요.`);
      return;
    }

    if (field === "email" && !isValidEmail(value)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (field === "nickname" && !isValidNickname(value)) {
      alert("닉네임은 10자까지 가능합니다.");
      return;
    }

    try {
      const result = await checkDuplicate(field, value, BASE_URL);
      alert(result);
    } catch (err) {
      console.error("중복체크 에러:", err);
      alert("중복체크 요청 실패");
    }
  };

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

    if (!isValidPassword(password)) {
      alert("비밀번호는 8~12자이며 숫자, 문자, 특수문자를 모두 포함해야 합니다.");
      return;
    }

    if (!isValidNickname(nickname)) {
      alert("닉네임은 10자까지 가능합니다.");
      return;
    }

    try {
      await signUp(email, password, nickname, BASE_URL);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      console.error("회원가입 에러:", err);
      alert("회원가입 요청 실패");
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
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
          회원가입
        </Typography>

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
            onClick={() => handleDuplicateCheck("nickname")}
          >
            중복체크
          </Button>
        </Box>

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
            onClick={() => handleDuplicateCheck("email")}
          >
            중복체크
          </Button>
        </Box>

        <TextField
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <Typography variant="caption" color="textSecondary">
          비밀번호는 8~12자이며 숫자, 문자, 특수문자를 모두 포함해야 합니다.
        </Typography>

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