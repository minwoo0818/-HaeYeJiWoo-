import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
} from "@mui/material";

export default function AdminPage() {
  const [open, setOpen] = useState(false);

  // 업로드 개수 상태 (최소 1 ~ 최대 5)
  const [uploadCount, setUploadCount] = useState(1);

  // 업로드 용량 상태 (단위: MB)
  const [uploadSize, setUploadSize] = useState(10);

  // 허용 파일 확장자 상태 (쉼표로 구분된 문자열)
  const [fileExtensions, setFileExtensions] = useState("jpg, png, pdf");

  useEffect(() => {
    if (!open) return;

    const fetchSettings = async () => {
      const token = sessionStorage.getItem("jwt");
      try {
        const res = await fetch("/admin/main", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUploadCount(data.file_max_num);
          setUploadSize(data.file_size);
          setFileExtensions(data.file_type);
        } else {
          console.warn("설정 불러오기 실패:", await res.text());
        }
      } catch (err) {
        console.error("설정 불러오기 에러:", err);
      }
    };

    fetchSettings();
  }, [open]);

  // 취소 버튼 클릭 시 모달 닫기
  const handleCancel = () => {
    setOpen(false);
  };

  // 저장 버튼 클릭 시 설정값을 서버에 PUT 요청으로 전송
  const handleSave = async () => {
    const payload = {
      file_max_num: uploadCount,
      file_size: uploadSize,
      file_type: fileExtensions,
    };

    const token = sessionStorage.getItem("jwt");

    try {
      await fetch("/api/admin/main", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      alert("설정이 저장되었습니다.");
      setOpen(false);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {/* 설정 열기 버튼 */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: "#474747",
            color: "#fff",
            height: "10px", // 버튼 높이 설정
            minHeight: "10px", // MUI 기본 높이 무시
            padding: 3, // 내부 여백 제거
            fontSize: "20px", // 텍스트 크기 조절 (선택)
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          첨부파일 설정
        </Button>
      </Box>

      {/* 모달 다이얼로그 */}
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <Box
          sx={{
            padding: 4,
            backgroundColor: "#fff",
          }}
        >
          {/* 페이지 제목 */}
          <Typography variant="h6" gutterBottom>
            첨부파일 설정
          </Typography>

          {/* 업로드 개수 드롭다운: 최소 1 ~ 최대 5 선택 */}
          <FormControl fullWidth margin="normal">
            <InputLabel>업로드 개수(1~5)</InputLabel>
            <Select
              value={uploadCount}
              label="업로드 개수(1~5)"
              onChange={(e) => setUploadCount(Number(e.target.value))}
              renderValue={() => `${uploadCount}`}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <MenuItem key={num} value={num}>
                  <ListItemIcon>
                    <Radio
                      checked={uploadCount === num}
                      value={num}
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemText primary={`${num}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 업로드 용량 입력 필드: 숫자 입력, 단위 MB 표시 */}
          <TextField
            fullWidth
            margin="normal"
            label="업로드 용량"
            type="number"
            value={uploadSize}
            onChange={(e) => setUploadSize(Number(e.target.value))}
            InputProps={{
              endAdornment: <Typography sx={{ ml: 1 }}>MB</Typography>,
            }}
          />

          {/* 허용 확장자 입력 필드: 쉼표로 구분된 텍스트 입력 */}
          <TextField
            fullWidth
            margin="normal"
            label="허용 확장자 (쉼표로 구분)"
            value={fileExtensions}
            onChange={(e) => setFileExtensions(e.target.value)}
          />

          {/* 버튼 영역: 취소 및 저장 */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            {/* 취소 버튼: 테두리 + 텍스트 색상 변경 */}
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                backgroundColor: "#474747",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              취소
            </Button>

            {/* 저장 버튼: 배경 + 텍스트 색상 변경 */}
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: "#474747",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              저장
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
