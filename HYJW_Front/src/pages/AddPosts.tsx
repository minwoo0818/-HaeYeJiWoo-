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

const navItems = [
  { name: "게임", id: "GAME" },
  { name: "맛집", id: "GOOD_RESTAURANT" },
  { name: "유머", id: "HUMOR" },
  { name: "일상", id: "DAILY_LIFE" },
];

export default function AddPosts() {
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

    // 해시태그 쉼표로 구분해서 배열로 변환
    const hashtagsArray = form.hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const payload = {
    categoryId: form.categoryId, // string
    title: form.title,           // string
    content: form.content,       // string
    hashtags: hashtagsArray,     // string[]
    files: [],                   // 빈 배열도 괜찮지만 FileCreateDto 형태여야 할 수도 있음
    };

    try {
      const res = await axios.post(`/api/posts/${userId}`, payload);
      console.log("게시글 등록 성공:", res.data);
      alert("게시글이 등록되었습니다!");
      // 초기화하거나 이동 처리 등 추가 가능
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