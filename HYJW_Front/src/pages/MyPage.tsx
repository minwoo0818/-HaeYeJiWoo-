// src/pages/MyPage.tsx
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import { useState } from "react";

const MyPage = () => {
  const [form, setForm] = useState({
    email: "user@example.com", // 고정값
    nickname: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    alert("수정되었습니다 (API 연동 예정)");
    // 여기에 비밀번호 확인 & 서버 업데이트 요청 등을 연결하면 됩니다.
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
      <Stack spacing={2} width={350}>
        <Typography variant="h4" align="center" fontWeight="bold">
          마이페이지
        </Typography>

        <TextField
          label="이메일"
          name="email"
          value={form.email}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="닉네임"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
        />

        <TextField
          label="비밀번호 확인"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#474747", "&:hover": { backgroundColor: "#333" }, padding: "10px 20px",    
      fontSize: "1.25rem",     
      fontWeight: "bold",
      borderRadius: "8px",     
      width: "100%",          
      maxWidth: "400px",    
      }}   
          onClick={handleUpdate}
        >
          개인정보 수정
        </Button>
      </Stack>
    </Box>
  );
};

export default MyPage;
