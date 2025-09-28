import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { useAuthStore } from "../authStore";
import { loginRequest } from "../api/LoginApi";

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const { nickname, token } = await loginRequest(form, BASE_URL);
      if (token) {
  sessionStorage.setItem("jwt", token);
} else {
  throw new Error("토큰이 없습니다.");
}

      login(nickname);
      alert("로그인 성공!");
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("401")) {
          alert("이메일 또는 비밀번호가 잘못되었습니다.");
        } else if (err.message.includes("500")) {
          alert("서버 오류입니다. 잠시 후 다시 시도해주세요.");
        } else {
          alert(err.message);
        }
        console.error("로그인 에러:", err.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
        console.error("로그인 에러:", err);
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
      <Stack spacing={2} width={330}>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
          로그인
        </Typography>

        <Typography align="center">
          HYJW 멤버 커뮤니티에 오신 것을 환영합니다.
        </Typography>

        <TextField
          label="이메일"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

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