import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const navItems = [
  { name: "게임", id: "GAME" },
  { name: "맛집", id: "GOOD_RESTAURANT" },
  { name: "유머", id: "HUMOR" },
  { name: "일상", id: "DAILY_LIFE" },
];

const SENSITIVE_PATTERNS: { name: string; regex: RegExp; label: string }[] = [
  {
    name: "email",
    label: "이메일",
    regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
  },
  {
    name: "phone",
    label: "전화번호",
    regex: /(?:0\d{1,2}[- ]?\d{3,4}[- ]?\d{4})/g,
  },
  { name: "rrn", label: "주민등록번호", regex: /\b\d{6}[- ]?\d{7}\b/g },
  {
    name: "creditcard",
    label: "신용카드번호",
    regex: /\b(?:\d[ -]*?){13,16}\b/g,
  },
];

type SensitiveFound = {
  name: string;
  label: string;
  matches: string[];
};

export default function AddPosts() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
    hashtags: "",
    files: null as File | File[] | null,
  });

  const [previewShowSensitive, setPreviewShowSensitive] = useState(false);
  const [sensitiveModalOpen, setSensitiveModalOpen] = useState(false);
  const [sensitiveFound, setSensitiveFound] = useState<SensitiveFound[]>([]);
  const [autoMaskOnProceed, setAutoMaskOnProceed] = useState(true);

  const [uploadLimit, setUploadLimit] = useState(1);
  const [uploadSize, setUploadSize] = useState(10); // MB
  const [allowedExtensions, setAllowedExtensions] = useState("jpg, png, pdf");

  // refs for overlay sync
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // keep textarea height auto-adjust
  const [textareaHeight, setTextareaHeight] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    // update height on content change to match preview
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = "auto";
    const newHeight = Math.max(120, ta.scrollHeight); // 최소 높이
    ta.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
  }, [form.content]);

  useEffect(() => {
    // 💡 JWT 토큰 키가 'jwt'라고 가정하고 통일하여 사용
    const token = sessionStorage.getItem("jwt"); 
    fetch(`${BASE_URL}/admin/main`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUploadLimit(data.file_max_num);
        setUploadSize(data.file_size);
        setAllowedExtensions(data.file_type);
      })
      .catch((err) => {
        console.error("설정값 불러오기 실패:", err);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, categoryId: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const allowed = allowedExtensions
      .split(",")
      .map((ext) => ext.trim().toLowerCase());

    const validFiles: File[] = [];
    const rejectedMessages: string[] = [];

    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const sizeMB = file.size / (1024 * 1024);

      if (!ext || !allowed.includes(ext)) {
        rejectedMessages.push(`- ${file.name}: 허용되지 않은 확장자 (.${ext})`);
        continue;
      }

      if (sizeMB > uploadSize) {
        rejectedMessages.push(
          `- ${file.name}: ${uploadSize}MB 초과 (${sizeMB.toFixed(2)}MB)`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (rejectedMessages.length > 0) {
      alert(
        `다음 파일은 조건에 맞지 않아 제외되었습니다:\n\n${rejectedMessages.join(
          "\n"
        )}`
      );
    }

    if (validFiles.length === 0) {
      alert("조건에 맞는 파일이 없습니다. 확장자 또는 용량을 확인해주세요.");
      e.target.value = ""; // ✅ input 초기화
      return;
    }

    if (validFiles.length > uploadLimit) {
      alert(`최대 ${uploadLimit}개의 파일만 업로드할 수 있습니다.`);
      e.target.value = ""; // ✅ input 초기화
      return;
    }

    setForm((prev) => ({
      ...prev,
      files: validFiles.length === 1 ? validFiles[0] : validFiles,
    }));
  };
  const findSensitiveMatches = (text: string): SensitiveFound[] => {
    const results: Record<string, Set<string>> = {};
    for (const { name, regex } of SENSITIVE_PATTERNS) {
      const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
      const re = new RegExp(regex.source, flags);
      for (const m of text.matchAll(re)) {
        if (!m[0]) continue;
        if (!results[name]) results[name] = new Set();
        results[name].add(m[0]);
      }
    }
    const out: SensitiveFound[] = [];
    for (const def of SENSITIVE_PATTERNS) {
      if (results[def.name] && results[def.name].size > 0) {
        out.push({
          name: def.name,
          label: def.label,
          matches: Array.from(results[def.name]),
        });
      }
    }
    return out;
  };

  const maskSensitiveInText = (text: string, maskChar = "●") => {
    let masked = text;
    for (const { regex } of SENSITIVE_PATTERNS) {
      const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
      const re = new RegExp(regex.source, flags);
      masked = masked.replace(re, (m) =>
        maskChar.repeat(Math.max(4, m.length))
      );
    }
    return masked;
  };

  // This returns masked text for overlay (string with same line breaks)
  const getOverlayText = (text: string) => {
    if (!text) return "";
    if (previewShowSensitive) return text;
    return maskSensitiveInText(text);
  };

  // renderPreview used in modal/etc (keeps previous behavior)
  const renderPreview = (text: string) => {
    if (!text)
      return (
        <span style={{ color: "#666" }}>
          미리보기: 본문을 입력하면 민감정보가 자동 감지됩니다.
        </span>
      );
    if (previewShowSensitive)
      return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
    // simple masked rendering
    const masked = getOverlayText(text);
    return <span style={{ whiteSpace: "pre-wrap" }}>{masked}</span>;
  };

  // sync scroll between textarea and preview
  const syncScroll = () => {
    if (!textareaRef.current || !previewRef.current) return;
    previewRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  const handleSubmit = async () => {
    const userId = 1;

    const hashtagsArray = form.hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const found = findSensitiveMatches(form.content || "");
    if (found.length > 0) {
      setSensitiveFound(found);
      setSensitiveModalOpen(true);
      return;
    }

    await proceedSubmit(
      {
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        hashtags: hashtagsArray,
        files: form.files,
      },
      userId
    );
  };

 // AddPosts.tsx 파일에서 proceedSubmit 함수만 아래와 같이 수정하세요.

// AddPosts.tsx 파일에서 proceedSubmit 함수만 아래와 같이 수정하세요.

const proceedSubmit = async (
  payload: {
    categoryId: string;
    title: string;
    content: string;
    hashtags: string[]; // ['태그1', '태그2', ...]
    files: File | File[] | null;
  },
  userId: number
) => {
  const token = sessionStorage.getItem("jwt");

  if (!token) {
    console.error("JWT 토큰이 sessionStorage에 없어 요청을 중단합니다.");
    alert("로그인이 필요합니다.");
    navigate("/login");
    return;
  }

  const hasFiles = payload.files && (Array.isArray(payload.files) ? payload.files.length > 0 : true);
  const endpoint = hasFiles ? `/posts/create/file/${userId}` : `/posts/create/no_file/${userId}`;
  const url = `${BASE_URL}${endpoint}`;

  // 1. 서버의 @ModelAttribute에 맞게 FormData 객체 생성
  const fd = new FormData();
  fd.append("categoryId", payload.categoryId);
  fd.append("title", payload.title);
  fd.append("content", payload.content);
  
  // 💡 수정된 부분: 해시태그 배열의 각 요소를 개별적으로 append
  // 서버의 List<String> hashtags 필드에 자동으로 바인딩됩니다.
  payload.hashtags.forEach(tag => {
      fd.append("hashtags", tag);
  });
  
  // 2. 파일이 있을 경우만 FormData에 추가 (기존 로직 유지)
  if (hasFiles) {
    if (Array.isArray(payload.files)) {
      payload.files.forEach((file) => {
        fd.append("files", file);
      });
    } else if (payload.files) {
      fd.append("files", payload.files);
    }
  }
  
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await axios.post(url, fd, { headers });

    console.log("게시글 등록 성공:", res.data);
    alert("게시글이 등록되었습니다!");
    navigate("/posts/all");
  } catch (err) {
    console.error("게시글 등록 실패:", err);
    alert("등록에 실패했습니다. 콘솔을 확인하세요.");
  }
};

  const handleModalProceed = async () => {
    setSensitiveModalOpen(false);

    let finalContent = form.content;
    if (autoMaskOnProceed)
      finalContent = maskSensitiveInText(finalContent || "");

    const hashtagsArray = form.hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    await proceedSubmit(
      {
        categoryId: form.categoryId,
        title: form.title,
        content: finalContent || "",
        hashtags: hashtagsArray,
        files: form.files,
      },
      1
    );
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
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
        <TextField
          label="제목"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
        />

        {/* ---------- 여기부터 오버레이 방식 입력 영역 ---------- */}
        <div style={{ position: "relative", width: "100%" }}>
          {/* masked preview layer (underneath) */}
          <div
            ref={previewRef}
            aria-hidden
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              padding: "12px",
              minHeight: 120,
              border: "1px solid #ccc",
              borderRadius: 6,
              background: "#fafafa",
              color: "#222",
              // ensure it sits under the textarea
              position: "relative",
              zIndex: 1,
              overflowY: "auto",
              pointerEvents: "none", // 클릭은 textarea로 통과
              fontFamily: "inherit",
              lineHeight: 1.5,
              height: textareaHeight ? `${textareaHeight}px` : "auto",
            }}
          >
            {getOverlayText(form.content)}
          </div>

          {/* real textarea (transparent text, visible caret) */}
          <textarea
            ref={textareaRef}
            name="content"
            value={form.content}
            onChange={(e) => {
              handleChange(e);
            }}
            onScroll={syncScroll}
            placeholder="본문"
            style={{
              // overlay on top
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              border: "1px solid transparent", // 보더는 아래 레이어가 보이므로 투명
              minHeight: 120,
              borderRadius: 6,
              resize: "vertical",
              background: "transparent",
              color: "transparent", // 텍스트는 투명 (미리보기 레이어가 보이도록)
              caretColor: "#000", // 커서 색은 보이게
              zIndex: 2,
              overflow: "auto",
              fontFamily: "inherit",
              lineHeight: 1.5,
              outline: "none",
            }}
            rows={6}
          />
        </div>
        {/* ---------- 오버레이 입력 영역 끝 ---------- */}
        <div>
          <input type="file" multiple onChange={handleFileChange} />
          <p>
            최대 {uploadLimit}개 / 파일당 {uploadSize}MB / 허용 확장자:{" "}
            {allowedExtensions}
          </p>
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={previewShowSensitive}
              onChange={(e) => setPreviewShowSensitive(e.target.checked)}
            />
          }
          label="민감정보 보기(미리보기에서 원문 표시)"
        />

        <TextField
          label="해시태그 (쉼표로 구분)"
          name="hashtags"
          value={form.hashtags}
          onChange={handleChange}
          fullWidth
        />

        <input
          type="file"
          onChange={handleFileChange}
          accept={allowedExtensions
            .split(",")
            .map((ext) => `.${ext.trim()}`)
            .join(",")}
        />

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
            minWidth: "100px",
          }}
        >
          등록
        </Button>
      </Stack>

      <Dialog
        open={sensitiveModalOpen}
        onClose={() => setSensitiveModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>민감정보가 감지되었습니다</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            작성하신 본문에서 다음과 같은 민감정보가 감지되었습니다. 계속
            진행하면 이 게시글이 공개됩니다.
          </Typography>

          <List dense>
            {sensitiveFound.map((s) => (
              <div key={s.name}>
                <ListItem>
                  <ListItemText
                    primary={`${s.label} (${s.matches.length}건)`}
                    secondary={
                      s.matches.slice(0, 3).join(", ") +
                      (s.matches.length > 3 ? " 등" : "")
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>

          <FormControlLabel
            control={
              <Checkbox
                checked={autoMaskOnProceed}
                onChange={(e) => setAutoMaskOnProceed(e.target.checked)}
              />
            }
            label="자동 마스킹 적용 후 등록 (민감정보를 ●로 대체)"
          />
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 1 }}
          >
            참고: 클라이언트 마스킹은 브라우저 개발자도구로 원문 확인을 완전히
            막을 수 없습니다. 서버에서도 동일한 검사를 수행하고 마스킹 또는
            제지를 권장합니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSensitiveModalOpen(false)}>취소</Button>
          <Button
            onClick={handleModalProceed}
            variant="contained"
            color="primary"
          >
            계속 (등록)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}