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
  Paper, // 그래프를 담을 Paper 컴포넌트 추가
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"; // Recharts 라이브러리 import

const BASE_URL = import.meta.env.VITE_API_URL;

// 가상의 방문자 통계 데이터 구조 (서버 응답을 시뮬레이션)
const mockDailyData = [
  { day: '9/24', visitors: 150 },
  { day: '9/25', visitors: 220 },
  { day: '9/26', visitors: 180 },
  { day: '9/27', visitors: 250 },
  { day: '9/28', visitors: 300 },
];

const mockMonthlyData = [
  { month: 'Jan', visitors: 4000 },
  { month: 'Feb', visitors: 3000 },
  { month: 'Mar', visitors: 5500 },
  { month: 'Apr', visitors: 4500 },
  { month: 'May', visitors: 6000 },
];


export default function AdminPage() {
  const [open, setOpen] = useState(false);

  // 첨부파일 설정 상태
  const [uploadCount, setUploadCount] = useState(1);
  const [uploadSize, setUploadSize] = useState(10);
  const [fileExtensions, setFileExtensions] = useState("jpg, png, pdf");

  // 💡 방문자 통계 상태 추가
  const [dailyVisitors, setDailyVisitors] = useState([]);
  const [monthlyVisitors, setMonthlyVisitors] = useState([]);


  useEffect(() => {
    // 💡 초기 로딩 시와 모달이 열릴 때 모두 설정 및 통계 데이터 불러오기
    const fetchSettingsAndStats = async () => {
      const token = sessionStorage.getItem("jwt");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. 첨부파일 설정 불러오기
      try {
        const settingsRes = await fetch(`${BASE_URL}/admin/main`, { method: "GET", headers });

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setUploadCount(data.file_max_num);
          setUploadSize(data.file_size);
          setFileExtensions(data.file_type);
        } else {
          console.warn("설정 불러오기 실패:", await settingsRes.text());
        }
      } catch (err) {
        console.error("설정 불러오기 에러:", err);
      }
      
      // 2. 💡 방문자 통계 데이터 불러오기
      try {
        // 서버의 통계 엔드포인트를 /api/admin/stats로 가정
        const statsRes = await fetch(`${BASE_URL}/admin/stats`, { method: "GET", headers });
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          // 서버 응답 구조가 { daily: [], monthly: [] }라고 가정
          setDailyVisitors(statsData.daily || mockDailyData);
          setMonthlyVisitors(statsData.monthly || mockMonthlyData);
        } else {
          console.warn("통계 불러오기 실패:", await statsRes.text());
          // 통계 실패 시 Mock 데이터 사용 (개발 편의를 위해)
          setDailyVisitors(mockDailyData);
          setMonthlyVisitors(mockMonthlyData);
        }
      } catch (err) {
        console.error("통계 불러오기 에러:", err);
        setDailyVisitors(mockDailyData);
        setMonthlyVisitors(mockMonthlyData);
      }
    };

    fetchSettingsAndStats();
  }, []); // 💡 open 대신 초기 로딩 시점에 실행되도록 수정 (모달 외부의 그래프를 위해)


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
      const res = await fetch("/api/admin/main", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
          alert("설정이 저장되었습니다.");
          setOpen(false);
      } else {
          console.error("저장 실패 응답:", await res.text());
          alert("저장 중 오류가 발생했습니다.");
      }

    } catch (error) {
      console.error("저장 실패 에러:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 첨부파일 설정 버튼 영역 */}
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: "#474747",
            color: "#fff",
            // minHeight, padding, fontSize 등 스타일 조정
            padding: '8px 16px', 
            fontSize: "14px", 
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          첨부파일 설정 변경
        </Button>
      </Box>

      {/* ----------------------------- 💡 방문자 수 통계 그래프 영역 ----------------------------- */}

      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        사이트 방문자 통계
      </Typography>

      <Box display="flex" gap={4}>
        {/* 일별 방문자 수 (Line Chart) */}
        <Paper elevation={3} sx={{ flex: 1, padding: 3 }}>
          <Typography variant="h6" gutterBottom>일별 방문자 수 (최근 5일)</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dailyVisitors}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" name="방문자 수" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* 월별 방문자 수 (Bar Chart) */}
        <Paper elevation={3} sx={{ flex: 1, padding: 3 }}>
          <Typography variant="h6" gutterBottom>월별 방문자 수 (최근 5개월)</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyVisitors}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visitors" fill="#82ca9d" name="방문자 수" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>


      {/* ----------------------------- 첨부파일 설정 모달 다이얼로그 ----------------------------- */}
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
            {/* 취소 버튼 */}
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

            {/* 저장 버튼 */}
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
    </Box>
  );
}