import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("로그인 성공!");
      navigate("/category/all"); // 로그인 후 홈으로 이동
    } else {
      const msg = await res.text();
      alert(msg);
    }
  };

  return (
     <Box
      sx={{
        height: "100vh",          // 화면 전체 높이
        display: "flex",
        justifyContent: "center", // 가로 중앙 정렬
        alignItems: "center",     // 세로 중앙 정렬
      }}
    >

  <Stack spacing={2} width={330}>

    <Typography variant="h4" align="center" sx={{fontWeight: 'bold'}} >로그인</Typography>
    {/* 👇 환영 메시지: 로그인 위에 강조된 문구 */}
    <Typography align="center">HYJW 멤버 커뮤니티에 오신 것을 환영합니다.</Typography>

    <TextField 
    label="이메일" 
    name="email" 
    value={form.email} 
    onChange={handleChange} />

    <TextField
      label="비밀번호"
      name="password"
      type="password"
      value={form.password}
      onChange={handleChange}
    />

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
      로그인
    </Button>

    <Typography variant="body2" align="center">
      아직 HaYeJiWoo Member가 아니신가요?{" "}
      <span
        style={{
          color: "#0961baff",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={() => navigate("/signup")}
      >
        회원가입
      </span>
    </Typography>
  </Stack>
  </Box>
);
};

export default Login;
