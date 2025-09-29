import { useEffect, useRef, useState } from "react";
// import axios from "axios";
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
import { createPostNoFile, createPostWithFile, PostNoFileRequest } from "../api/postDetailApi"; 

// const BASE_URL = import.meta.env.VITE_API_URL;

const navItems = [
  { name: "게임", id: "GAME" },
  { name: "맛집", id: "GOOD_RESTAURANT" },
  { name: "유머", id: "HUMOR" },
  { name: "일상", id: "DAILY_LIFE" },
];

const SENSITIVE_PATTERNS: { name: string; regex: RegExp; label: string }[] = [
  { name: "email", label: "이메일", regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
  { name: "phone", label: "전화번호", regex: /(?:0\d{1,2}[- ]?\d{3,4}[- ]?\d{4})/g },
  { name: "rrn", label: "주민등록번호", regex: /\b\d{6}[- ]?\d{7}\b/g },
  { name: "creditcard", label: "신용카드번호", regex: /\b(?:\d[ -]*?){13,16}\b/g },
];

type SensitiveFound = {
  name: string;
  label: string;
  matches: string[];
};

export default function AddPosts() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
    hashtags: "",
    files: null as File | null,
  });

  const [previewShowSensitive, setPreviewShowSensitive] = useState(false);
  const [sensitiveModalOpen, setSensitiveModalOpen] = useState(false);
  const [sensitiveFound, setSensitiveFound] = useState<SensitiveFound[]>([]);
  const [autoMaskOnProceed, setAutoMaskOnProceed] = useState(true);

  // refs for overlay sync
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // keep textarea height auto-adjust
  const [textareaHeight, setTextareaHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    // update height on content change to match preview
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = "auto";
    const newHeight = Math.max(120, ta.scrollHeight); // 최소 높이
    ta.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
  }, [form.content]);

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
        out.push({ name: def.name, label: def.label, matches: Array.from(results[def.name]) });
      }
    }
    return out;
  };

  const maskSensitiveInText = (text: string, maskChar = "●") => {
    let masked = text;
    for (const { regex } of SENSITIVE_PATTERNS) {
      const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
      const re = new RegExp(regex.source, flags);
      masked = masked.replace(re, (m) => maskChar.repeat(Math.max(4, m.length)));
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
    if (!text) return <span style={{ color: "#666" }}>미리보기: 본문을 입력하면 민감정보가 자동 감지됩니다.</span>;
    if (previewShowSensitive) return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
    // simple masked rendering
    const masked = getOverlayText(text);
    return <span style={{ whiteSpace: "pre-wrap" }}>{masked}</span>;
  };

  // sync scroll between textarea and preview
  const syncScroll = () => {
    if (!textareaRef.current || !previewRef.current) return;
    previewRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  // 최종 제출 로직 (API 호출)
  const handleFinalSubmit = async (finalContent: string) => {
    setIsLoading(true);
    const hasFile = form.files instanceof File && form.files.size > 0;

    const hashtagsArray = form.hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      if (hasFile) {
        // 1. 파일 포함 게시글 등록
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", finalContent);
        formData.append("categoryId", form.categoryId);
        formData.append("file", form.files as File);
        // 해시태그는 배열로 보내야 할 경우:
        hashtagsArray.forEach((h) => formData.append("hashtags", h));

        await createPostWithFile(formData);
        console.log("게시글 등록 성공 (파일 포함)");
      } else {
        // 2. 파일 없는 게시글 등록
        const postData: PostNoFileRequest = {
          title: form.title,
          content: finalContent,
          categoryId: form.categoryId,
          hashtags: hashtagsArray,
        };
        await createPostNoFile(postData);
        console.log("게시글 등록 성공 (파일 없음)");
      }

      alert("게시글이 등록되었습니다!");
      navigate("/posts/all");
    } catch (err : any) {
      console.error("게시글 등록 실패:", err);
      // Axios 에러 처리 (예: 401 Unauthorized)
      let errorMessage = "등록에 실패했습니다. 서버 또는 네트워크 상태를 확인하세요.";
      if (err.response && err.response.status === 401) {
        errorMessage = "등록 실패: 인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.";
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 제출 버튼 클릭 시 호출되는 함수 (민감 정보 검사 및 분기)
  const handleSubmit = async () => {
    // 폼 필수 입력값 검사
    if (!form.title || !form.content || !form.categoryId) {
        alert("제목, 내용, 카테고리를 모두 입력해주세요.");
        return;
    }
    
    if (isLoading) return;

    const found = findSensitiveMatches(form.content || "");
    if (found.length > 0) {
      setSensitiveFound(found);
      setSensitiveModalOpen(true);
      return;
    }

    // 민감 정보가 없으면 바로 최종 제출 진행
    await handleFinalSubmit(form.content);
  };

  // 민감 정보 모달에서 '진행' 버튼 클릭 시 호출되는 함수
  const handleModalProceed = async () => {
    setSensitiveModalOpen(false);

    let finalContent = form.content;
    // 마스킹 옵션이 켜져 있으면 내용 마스킹
    if (autoMaskOnProceed) finalContent = maskSensitiveInText(finalContent || "");

    // 최종 제출 로직을 handleFinalSubmit으로 통일
    await handleFinalSubmit(finalContent);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "auto" }}>
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
        <TextField label="제목" name="title" value={form.title} onChange={handleChange} fullWidth />

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

        <FormControlLabel
          control={<Checkbox checked={previewShowSensitive} onChange={(e) => setPreviewShowSensitive(e.target.checked)} />}
          label="민감정보 보기(미리보기에서 원문 표시)"
        />

        <TextField label="해시태그 (쉼표로 구분)" name="hashtags" value={form.hashtags} onChange={handleChange} fullWidth />

        <input type="file" onChange={handleFileChange} />

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

      <Dialog open={sensitiveModalOpen} onClose={() => setSensitiveModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>민감정보가 감지되었습니다</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            작성하신 본문에서 다음과 같은 민감정보가 감지되었습니다. 계속 진행하면 이 게시글이 공개됩니다.
          </Typography>

          <List dense>
            {sensitiveFound.map((s) => (
              <div key={s.name}>
                <ListItem>
                  <ListItemText primary={`${s.label} (${s.matches.length}건)`} secondary={s.matches.slice(0, 3).join(", ") + (s.matches.length > 3 ? " 등" : "")} />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>

          <FormControlLabel
            control={<Checkbox checked={autoMaskOnProceed} onChange={(e) => setAutoMaskOnProceed(e.target.checked)} />}
            label="자동 마스킹 적용 후 등록 (민감정보를 ●로 대체)"
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            참고: 클라이언트 마스킹은 브라우저 개발자도구로 원문 확인을 완전히 막을 수 없습니다. 서버에서도 동일한 검사를 수행하고 마스킹 또는 제지를 권장합니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSensitiveModalOpen(false)}>취소</Button>
          <Button onClick={handleModalProceed} variant="contained" color="primary">
            계속 (등록)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
