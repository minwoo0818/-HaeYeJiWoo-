import { Button, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
};

const checkDuplicate = async (field: "email" | "nickname") => {
    const res = await fetch(`${BASE_URL}/auth/check-${field}?value=${form[field]}`);
    const data = await res.text();
    alert(data); // 예: "사용 가능한 이메일입니다."
  };


const handleSubmit = async () => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("회원가입 성공!");
      navigate("/login"); // 회원가입 후 로그인 페이지로 이동
    } else {
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
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
          회원가입
        </Typography>

        {/* 닉네임 입력 + 중복체크 */}
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
      whiteSpace: 'nowrap',
      minWidth: '60px',       
      padding: '4px 6px',     
      fontSize: '0.75rem'     
    }}
    onClick={() => checkDuplicate("nickname")}
  >
            중복체크
          </Button>
        </Box>

        {/* 이메일 입력 + 중복체크 */}
        <Box display="flex" gap={1} >
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
      whiteSpace: 'nowrap',
      minWidth: '60px',       
      padding: '4px 6px',     
      fontSize: '0.75rem'     
    }}
    onClick={() => checkDuplicate("email")}
          >
            중복체크
          </Button>
        </Box>

        {/* 비밀번호 */}
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {/* 회원가입 버튼 (회색) */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ backgroundColor: "#474747", "&:hover": { backgroundColor: "#333" }, padding: "10px 20px",    
      fontSize: "1.25rem",     
      fontWeight: "bold",
      borderRadius: "8px",     
      width: "100%",          
      maxWidth: "400px",    
      }}   
        >
          회원가입
        </Button>

        {/* 로그인 이동 버튼 (파란 텍스트 버튼) */}
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