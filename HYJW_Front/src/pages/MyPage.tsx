import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { getUserInfo, updateUserInfo } from "../api/MyPageApi"; 

const MyPage = () => {
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      console.warn("토큰 없음");
      return;
    }

    getUserInfo(token)
      .then((data) => {
        setForm({
          email: data.email,
          nickname: data.userNickname,
          password: "",
        });
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패:", err.message);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await updateUserInfo(token, {
        email: form.email,
        nickname: form.nickname,
        password: form.password,
      });
      alert("수정되었습니다.");
    } catch (err: unknown) {
  if (err instanceof Error) {
    console.error("수정 요청 실패:", err.message);
    alert("수정 실패: " + err.message);
  } else {
    console.error("알 수 없는 오류:", err);
    alert("예기치 못한 오류가 발생했습니다.");
  }
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
      <Stack spacing={2} width={350}>
        <Typography variant="h4" align="center" fontWeight="bold">
          마이페이지
        </Typography>

        <TextField
          label="이메일"
          name="email"
          value={form.email}
          onChange={handleChange}
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
          onClick={handleUpdate}
        >
          개인정보 수정
        </Button>
      </Stack>
    </Box>
  );
};

export default MyPage;
