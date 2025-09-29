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

  const handleSubmit = async () => {
    const userId = 1;
    const hasFile = form.files && form.files.size > 0; //파일 존재 여부 확인 

    const url = hasFile ? `/api/posts/create/file/${userId}` : `/api/posts/create/no_file/${userId}`;

    // 해시태그 쉼표로 구분해서 배열로 변환
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

    await proceedSubmit({ categoryId: form.categoryId, title: form.title, content: form.content, hashtags: hashtagsArray, files: form.files }, userId);
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

  const proceedSubmit = async (payload: { categoryId: string; title: string; content: string; hashtags: string[]; files: File | null }, userId: number) => {
    try {
      if (!payload.files) {
        const body = {
          categoryId: payload.categoryId,
          title: payload.title,
          content: payload.content,
          hashtags: payload.hashtags,
        };
        const res = await axios.post(`/api/posts/${userId}`, body);
        console.log("게시글 등록 성공:", res.data);
      } else {
        const fd = new FormData();
        fd.append("categoryId", payload.categoryId);
        fd.append("title", payload.title);
        fd.append("content", payload.content);
        fd.append("hashtags", JSON.stringify(payload.hashtags));
        fd.append("file", payload.files);
        const res = await axios.post(`/api/posts/${userId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("게시글 등록 성공 (with file):", res.data);
      }

      alert("게시글이 등록되었습니다!");
      navigate("/posts/all");
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      alert("등록에 실패했습니다.");
    }
  };

  const handleModalProceed = async () => {
    setSensitiveModalOpen(false);

    let finalContent = form.content;
    if (autoMaskOnProceed) finalContent = maskSensitiveInText(finalContent || "");

    const hashtagsArray = form.hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    await proceedSubmit({ categoryId: form.categoryId, title: form.title, content: finalContent || "", hashtags: hashtagsArray, files: form.files }, 1);
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
