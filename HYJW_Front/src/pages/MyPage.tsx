// src/pages/MyPage.tsx
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyPassword } from "../api/MypageApi";

const MyPage = () => {
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
  });
  const [inputPassword, setInputPassword] = useState("");
  const [showPage, setShowPage] = useState(false);
  const [openModal, setOpenModal] = useState(true);
  const navigate = useNavigate();

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

  const handleVerify = async () => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    try {
      await verifyPassword(token, inputPassword);
      setShowPage(true); // 마이페이지 보여주기
      setOpenModal(false); // 모달 닫기
    } catch (err: any) {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleUpdate = async () => {
    const token = sessionStorage.getItem("jwt");
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: form.email,
          userNickname: form.nickname,
          password: form.password,
        }),
      });

      if (res.ok) {
        alert("수정되었습니다.");
        navigate("/posts/all");
      } else {
        alert("수정 실패: " + (await res.text()));
      }
    } catch (err) {
      console.error("수정 요청 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <>
      {/* ✅ 비밀번호 인증 모달 */}
      {openModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <Stack
            spacing={2}
            sx={{ backgroundColor: "#fff", padding: 4, borderRadius: 2 }}
          >
            <Typography variant="h6" align="center">
              비밀번호를 입력해주세요
            </Typography>
            <TextField
              label="비밀번호"
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={handleVerify}
                sx={{
                  backgroundColor: "#474747",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                확인
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate(-1)} // 이전 페이지로 이동
                sx={{
                  backgroundColor: "#474747",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                취소
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {/* ✅ 마이페이지 본문은 인증 성공 시만 보여줌 */}
      {showPage && (
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
      )}
    </>
  );
};

export default MyPage;
