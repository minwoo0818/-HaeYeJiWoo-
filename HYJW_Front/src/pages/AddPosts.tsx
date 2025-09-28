import { useState } from "react";
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "게임", id: "GAME" },
  { name: "맛집", id: "GOOD_RESTAURANT" },
  { name: "유머", id: "HUMOR" },
  { name: "일상", id: "DAILY_LIFE" },
];

export default function AddPosts() {
  const navigate = useNavigate();   // 이동 훅
  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
    hashtags: "",
    files: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, categoryId: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, files: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    const userId = 1; // 임시 사용자 ID

    const hasFile = form.files && form.files.size > 0; //파일 존재 여부 확인 

    const url = hasFile ? `/api/posts/create/file/${userId}` : `/api/posts/create/no_file/${userId}`;

    // 해시태그 쉼표로 구분해서 배열로 변환
    const hashtagsArray = form.hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

      //FormDate 생성
    const formdata = new FormData();
    formdata.append("categoryId", form.categoryId);
    formdata.append("title", form.title);
    formdata.append("content", form.content);
    hashtagsArray.forEach((h) => {
      formdata.append("hashtags", h);
    })
    // formdata.append("files", form.files ?? "");

    if (hasFile) {
      formdata.append("files", form.files as File);
    }

    try {
      const res = await axios.post( url, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
    });

      console.log("게시글 등록 성공:", res.data);
      alert("게시글이 등록되었습니다!");
      //작성 완료 후 PostList로 이동
      navigate("/posts/all");

    } catch (err) { 
      console.error("게시글 등록 실패:", err);
      alert("등록에 실패했습니다.");
    } 
  };


  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      {/* 제목 + 카테고리 드롭다운 수평 정렬 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">게시글 작성</Typography>
        <TextField
          select
          name="categoryId"
          value={form.categoryId}
          onChange={handleCategoryChange}
          size="small"
          sx={{ minWidth: 150 }}
        >
          {navItems.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Stack spacing={3}>
        {/* 제목 입력 */}
        <TextField
          label="제목"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
        />

        {/* 본문 입력 */}
        <TextField
          name="content"
          value={form.content}
          onChange={handleChange}
          multiline
          rows={6}
          placeholder="본문"
          fullWidth
        />

        {/* 해시태그 */}
        <TextField
          label="해시태그 (쉼표로 구분)"
          name="hashtags"
          value={form.hashtags}
          onChange={handleChange}
          fullWidth
        />

        {/* 파일 업로드 */}
        <input type="file" onChange={handleFileChange} />

        {/* 등록 버튼 */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#474747",
            "&:hover": { backgroundColor: "#333" },
            padding: "8px 20px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            alignSelf: "flex-end",
            width: "fit-content",
            minWidth: "100px"
          }}
        >
          등록
        </Button>
      </Stack>
    </Box>
  );
}