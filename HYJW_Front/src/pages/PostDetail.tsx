import { useEffect, useRef, useState } from "react";
import Comments from "../components/Comments";
import '../css/PostDetail.css'
import { useParams } from "react-router-dom";
import {
  getPostDetail,
  getCommentsByPostId,
  likePost,
  unlikePost,
  getPostLikeStatus,
  updatePost,
} from "../api/postDetailApi";
import type { Post } from "../types/PostType";
import type { Comment } from "../type";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const BASE_URL = import.meta.env.VITE_API_URL;

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 민감정보 패턴들
const SENSITIVE_PATTERNS: { name: string; regex: RegExp }[] = [
  // 이메일
  { name: "email", regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
  // 한국 전화번호 (010-1234-5678 또는 01012345678)
  { name: "phone", regex: /(?:0\d{1,2}[- ]?\d{3,4}[- ]?\d{4})/g },
  // 주민등록번호 (######-#######)
  { name: "rrn", regex: /\b\d{6}[- ]?\d{7}\b/g },
  // 신용카드 번호 (13~16자리, 공백/하이픈 포함 가능)
  { name: "creditcard", regex: /\b(?:\d[ -]*?){13,16}\b/g },
];

export default function PostDetail () {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(0);
  const [editingContent, setEditingContent] = useState<string>("");
  const [showAllSensitiveInPreview, setShowAllSensitiveInPreview] = useState(false);

  // 블러 토글 관리를 위해 id 세트 사용 (읽기 전용 뷰에서 사용)
  const [revealedTextIds, setRevealedTextIds] = useState<Record<string, boolean>>({});
  const [revealedImageUrls, setRevealedImageUrls] = useState<Record<string, boolean>>({});
  const uniqueIdRef = useRef(0);

  // refs & state for overlay editing input
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [textareaHeight, setTextareaHeight] = useState<number | undefined>(undefined);

  // 1. ✅ 수정 모드 상태 추가
  const [isEditing, setIsEditing] = useState(false);
  // 2. ✅ 수정 중인 내용을 위한 상태 추가
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showImageMap, setShowImageMap] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (id) {
      const postId = parseInt(id);
      getPostDetail(postId).then((postData) => {
        setPost(postData);
        setCurrentLikesCount(postData.likes);
        // 3. ✅ 기존 데이터를 수정 상태의 초기값으로 설정
        if (postData) {
          setEditTitle(postData.title);
          setEditContent(postData.content);
        }
      });
      getCommentsByPostId(postId).then((commentsData) => {
        setComments(commentsData);
      });
      getPostLikeStatus(postId).then(setLiked);
    }
  }, [id]);

  useEffect(() => {
    // textarea 높이 자동 조절 (편집 중)
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = "auto";
    const newHeight = Math.max(160, ta.scrollHeight); // 최소 높이 160px
    ta.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);

    // 스크롤 동기화: overlay가 scrollbar를 가지면 맞춰줌
    if (overlayRef.current) {
      overlayRef.current.scrollTop = ta.scrollTop;
    }
  }, [editingContent]);

  const handleLikeToggle = async () => {
    if (!post) return;
    try {
      if (liked) {
        await unlikePost(post.id);
        setCurrentLikesCount((prev) => prev - 1);
      } else {
        await likePost(post.id);
        setCurrentLikesCount((prev) => prev + 1);
      }
      setLiked((prev) => !prev);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      alert("좋아요 상태를 변경하는 중 오류가 발생했습니다.");
    }
  };
  // 4. ✅ 수정 모드 토글 함수
  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // 5. ✅ 저장(수정) 버튼 핸들러
  const handleSave = async () => {
    if (!post) return;

    const postId = parseInt(id as string);
    const updatedData = {
      title: editTitle,
      content: editContent,
    };

    try {
      const response = await updatePost(postId, updatedData);

      setPost(prevPost => {
        if (prevPost) {
          return { ...prevPost, ...response };
        }
        return response;
      }); // 서버에서 받은 최신 데이터로 업데이트
      setIsEditing(false); // 읽기 모드로 전환
      alert("게시글이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  // 6. ✅ 취소 버튼 핸들러
  const handleCancel = () => {
    // 기존 데이터로 복원하고 읽기 모드로 전환
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
    }
    setIsEditing(false);
  };

  // 편집용: overlay에 보여줄 텍스트 (마스킹/원문 토글)
  const maskSensitiveInText = (text: string, maskChar = "●") => {
    let masked = text;
    for (const { regex } of SENSITIVE_PATTERNS) {
      const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
      const re = new RegExp(regex.source, flags);
      masked = masked.replace(re, (m) => maskChar.repeat(Math.max(4, m.length)));
    }
    return masked;
  };

  const getOverlayText = (text: string) => {
    if (!text) return "";
    return showAllSensitiveInPreview ? text : maskSensitiveInText(text);
  };

  // 기존 리더용 렌더: 민감정보 토글 가능한 형태 (읽기 전용)
  const renderWithSensitiveBlur = (text: string | undefined) => {
    if (!text) return null;

    type MatchItem = {
      name: string;
      start: number;
      end: number;
      raw: string;
    };

    // 모든 패턴에 대해 매치 정보 수집 (start, end, raw, name)
    const matches: MatchItem[] = [];
    for (const { name, regex } of SENSITIVE_PATTERNS) {
      const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
      const re = new RegExp(regex.source, flags);
      for (const m of text.matchAll(re)) {
        if (m.index === undefined) continue;
        matches.push({
          name,
          start: m.index,
          end: m.index + m[0].length,
          raw: m[0],
        });
      }
    }

    if (matches.length === 0) {
      return <span>{text}</span>;
    }

    // 오버랩되는 매치는 시작 위치 기준으로 정렬 후 겹치면 우선순위(시작이 빠른 것) 유지
    matches.sort((a, b) => a.start - b.start);

    const filtered: MatchItem[] = [];
    let lastEnd = -1;
    for (const m of matches) {
      if (m.start >= lastEnd) {
        filtered.push(m);
        lastEnd = m.end;
      }
    }

    // 텍스트를 노드로 분해
    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    filtered.forEach((m) => {
      if (cursor < m.start) {
        nodes.push(<span key={`plain-${cursor}`}>{text.slice(cursor, m.start)}</span>);
      }
      const idKey = `${m.name}-${m.start}-${m.end - m.start}`;
      const revealed = !!revealedTextIds[idKey];
      nodes.push(
        <span key={idKey} className="pd-sensitive-wrapper">
          <span className={`pd-sensitive-text ${revealed ? "pd-unblur" : "pd-blur"}`}>
            {m.raw}
          </span>
          <button
            className="pd-reveal-btn"
            onClick={() => {
              setRevealedTextIds(prev => ({ ...prev, [idKey]: !prev[idKey] }));
            }}
            aria-pressed={revealed}
            title={revealed ? "숨기기" : "보기"}
          >
            {revealed ? "숨기기" : "보기"}
          </button>
        </span>
      );
      cursor = m.end;
    });

    if (cursor < text.length) {
      nodes.push(<span key={`plain-end-${cursor}`}>{text.slice(cursor)}</span>);
    }

    return <>{nodes}</>;
  };

  // helper: 본문에서 민감정보 찾기
  const findSensitiveMatches = (text: string) => {
    type Found = { name: string; matches: string[] };
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

    const out: Found[] = [];
    for (const key of Object.keys(results)) {
      out.push({ name: key, matches: Array.from(results[key]) });
    }
    return out;
  };

  // 편집 모드 토글 핸들러
  const startEditing = () => {
    setIsEditing(true);
    setEditingContent(post?.content ?? "");
    setShowAllSensitiveInPreview(false); // 기본은 마스킹
  };
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingContent(post?.content ?? "");
    setShowAllSensitiveInPreview(false);
  };

  // saveEditing 내부에서 민감정보 검사 후 사용자 확인을 요구합니다.
  const saveEditing = async () => {
    if (!post) return;

    // 1) 입력값에 민감정보가 있는지 검사
    const sensitiveFound = findSensitiveMatches(editingContent || "");

    if (sensitiveFound.length > 0) {
      // 요약 메시지 구성 (종류와 예시 최대 3개씩)
      let msg = "경고: 작성하신 내용에서 민감정보가 감지되었습니다.\n\n";
      for (const s of sensitiveFound) {
        const examples = s.matches.slice(0, 3).map(x => `"${x}"`).join(", ");
        msg += `- ${s.name}: ${examples}${s.matches.length > 3 ? " 등" : ""}\n`;
      }
      msg +=
        "\n개인정보(예: 이메일, 전화번호, 주민등록번호, 카드번호 등)를 게시하면 " +
        "개인정보 보호 규정에 위배될 수 있습니다.\n계속해서 게시물을 등록/수정하시겠습니까?";

      // 사용자 동의 받기
      const ok = window.confirm(msg);
      if (!ok) {
        // 사용자가 취소한 경우 저장 중단
        return;
      }
    }

    try {
      // TODO: 여기에 실제 저장 API 호출을 넣으세요 (예: updatePost or createPost)
      // 예:
      // await updatePost(post.id, { content: editingContent });

      // 임시 동작: 로컬 상태만 갱신
      const updated = { ...post, content: editingContent };
      setPost(updated);
      setIsEditing(false);

      alert("저장(등록)되었습니다.");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // scroll sync handler for overlay
  const handleTextareaScroll = () => {
    if (!textareaRef.current || !overlayRef.current) return;
    overlayRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  // 렌더링
  if (!post) {
    return <div>게시글을 불러오는 중...</div>;
  }
  
  return (
    <>
      <div className="pd-rootcontainer">
        <div className="pd-container">
          <div className="pd-post-header">
            <div className="pd-post-meta">
              <div className="pd-post-num"> 글 번호: {post.id} </div>
              <div className="view-count">조회수 {post.views}</div>
              {/* 작성자 이름과 좋아요 아이콘 */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "1px" }}
              >
                <span
                  onClick={handleLikeToggle}
                  style={{
                    cursor: "pointer",
                    color: liked ? "red" : "black",
                    fontSize: "20px",
                    borderRadius: "50%",
                    position: "relative",
                    top: "4px",
                  }}
                >
                  {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </span>
                <span>{currentLikesCount}</span>
              </div>
            </div>
          </div>
          <hr />

          <div className="pd-post-content">
            <div className="pd-post-title-bt">
              <div className="pd-post-title"><h2>{post.title}</h2></div>
              <div className="action-buttons">
                {/* 지수, 민우 수정  */}
                <button className="postupdate" onClick={startEditing}>수정</button>
                <button>삭제</button>
                {/* === 버튼 그룹 전환 === */}
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="postsave" onClick={handleSave}>
                      저장
                    </button>
                    <button className="postcancel" onClick={handleCancel}>
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <button className="postupdate" onClick={handleToggleEdit}>
                      수정
                    </button>
                    <button>삭제</button>
                  </>
                )}
              </div>
            </div>

            <div className="pd-post-info">
              <span className="author">
                <h3>작성자: {post.nickname}</h3>
              </span>
                            <span className="date">
                {post.updatedAt &&
                new Date(post.createdAt).getTime() !==
                  new Date(post.updatedAt).getTime()
                  ? `(수정) ${formatDateTime(post.updatedAt)} `
                  : formatDateTime(post.createdAt)}
              </span>
            </div>

            <div className="pd-post-body">
              {isEditing ? (
                <>
                  {/* 오버레이 방식 편집 입력창 (실시간 블러 / 미리보기 제거) */}
                  <div style={{ position: "relative", width: "100%" }}>
                    {/* 아래 레이어: 마스킹/원문 텍스트 (보이는 레이어) */}
                    <div
                      ref={overlayRef}
                      aria-hidden
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        padding: 12,
                        border: "1px solid #ccc",
                        borderRadius: 12,
                        background: "#fff",
                        color: "#222",
                        position: "relative",
                        zIndex: 1,
                        overflowY: "auto",
                        pointerEvents: "none",
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                        height: textareaHeight ? `${textareaHeight}px` : "auto",
                        minHeight: 160,
                      }}
                    >
                      {getOverlayText(editingContent)}
                    </div>

                    {/* 위 레이어: 실제 textarea (텍스트는 투명, 커서만 보임) */}
                    <textarea
                      ref={textareaRef}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      onScroll={handleTextareaScroll}
                      placeholder="본문을 입력하세요"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        boxSizing: "border-box",
                        padding: 12,
                        border: "1px solid transparent",
                        minHeight: 160,
                        borderRadius: 12,
                        resize: "vertical",
                        background: "transparent",
                        color: "transparent", // 텍스트 숨김
                        caretColor: "#000", // 커서 보이게
                        zIndex: 2,
                        overflow: "auto",
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                        outline: "none",
                      }}
                      rows={8}
                    />
                  </div>

                  <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={saveEditing}>저장</button>
                    <button onClick={cancelEditing}>취소</button>
                    <label style={{ marginLeft: 12, display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={showAllSensitiveInPreview}
                        onChange={(e) => setShowAllSensitiveInPreview(e.target.checked)}
                      />
                      <span>민감정보 전체 보기</span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* 읽기 전용 본문: 민감정보 블러(토글 가능) */}
                  {renderWithSensitiveBlur(post.content)}
                </>
              )}
            </div>

            {post.hashtags && post.hashtags.length > 0 &&
              <div className="pd-hashtags">
                {post.hashtags.map((tag: string) => `#${tag} `)}
              </div>
            }

            {post.hashtags && post.hashtags.length > 0 && post.files && post.files.length > 0 &&
              <hr/>
            }


      
            {post.files && post.files.length > 0 && (
              <div className="pd-attachment">
                첨부파일:
                {post.files.map((file, index) => {
                  // if (!file || !file.url || !file.fileName) return null;

                  // const fileExtension = file.fileName.split('.').pop()?.toLowerCase();
                  // const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '');

                  // const urlKey = `${file.url}-${index}`;


                  // return (
                  //   <div key={urlKey} className="attachment-item">
                  //     {isImage ? (
                  //       <div className="pd-image-wrapper">
                  //         <img
                  //           src={file.url}
                  //           alt={file.fileName}
                  //           className={`pd-attachment-image ${revealedImageUrls[urlKey] ? "pd-unblur" : "pd-blur"}`}
                  //           onClick={() => setRevealedImageUrls(prev => ({ ...prev, [urlKey]: !prev[urlKey] }))}
                  //         />
                  //         <div className="pd-image-controls">
                  //           <button
                  //             onClick={() => setRevealedImageUrls(prev => ({ ...prev, [urlKey]: true }))}
                  //           >
                  //             이미지 보기
                  //           </button>
                  //           <button
                  //             onClick={() => setRevealedImageUrls(prev => ({ ...prev, [urlKey]: false }))}
                  //           >
                  //             다시 블러
                  //           </button>
                  //         </div>
                  //       </div>
                  //     ) : (
                  //       <a href={file.url} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
                  // console.log("확인", file);
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {file.fileType && file.fileType.startsWith('image/') ? (
                        <>
                          <a
                            href={`${BASE_URL}${file.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default link behavior
                              setShowImageMap(prev => ({ ...prev, [index]: !prev[index] }));
                            }}
                          >
                            {`${file.fileOriginalName} (${
                              file.fileSize === null || file.fileSize === undefined
                                ? "크기 정보 없음"
                                : `${(file.fileSize / (1024 * 1024)).toFixed(3)}MB`
                            })`}
                          </a>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = `${BASE_URL}${file.url}`;
                              link.download = file.fileOriginalName || 'download';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            style={{ padding: '4px 8px', cursor: 'pointer' }}
                          >
                            다운로드
                          </button>
                          {showImageMap[index] && (
                            <img
                              src={`${BASE_URL}${file.url}`}
                              alt={file.fileOriginalName}
                              style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "8px", border: "1px solid #eee" }}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <a
                            href={`${BASE_URL}${file.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`${file.fileOriginalName} (${
                              file.fileSize === null || file.fileSize === undefined
                                ? "크기 정보 없음"
                                : `${(file.fileSize / (1024 * 1024)).toFixed(3)}MB`
                            })`}
                          </a>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = `${BASE_URL}${file.url}`;
                              link.download = file.fileOriginalName || 'download';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            style={{ padding: '4px 8px', cursor: 'pointer' }}
                          >
                            다운로드
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
                
              </div>
            )}

            <hr/>

          </div>

          {id && <Comments postId={parseInt(id)} comments={comments} setComments={setComments} />}

        </div>
      </div>
    </>
  );
}
