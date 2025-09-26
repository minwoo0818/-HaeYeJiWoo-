// src/pages/MyPage.tsx
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import { useState, useEffect } from "react";

const MyPage = () => {
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    console.log("토큰 확인:", token);
    fetch("/api/user/me", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
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

    try {
      const res = await fetch("http://localhost:8080/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          email: form.email,
          nickname: form.nickname,
          password: form.password,
        }),
      });

      if (res.ok) {
        alert("수정되었습니다.");
      } else {
        alert("수정 실패: " + (await res.text()));
      }
    } catch (err) {
      console.error("수정 요청 실패:", err);
      alert("오류가 발생했습니다.");
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
