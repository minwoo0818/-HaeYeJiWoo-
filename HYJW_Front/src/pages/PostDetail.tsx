import { useEffect, useRef, useState } from "react";
import Comments from "../components/Comments";
import '../css/PostDetail.css';
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

// 민감정보 패턴
const SENSITIVE_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: "email", regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
  { name: "phone", regex: /(?:0\d{1,2}[- ]?\d{3,4}[- ]?\d{4})/g },
  { name: "rrn", regex: /\b\d{6}[- ]?\d{7}\b/g },
  { name: "creditcard", regex: /\b(?:\d[ -]*?){13,16}\b/g },
];

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`;
};

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(0);

  // 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFiles, setEditFiles] = useState<Post['files']>([]);
  const [editHashtags, setEditHashtags] = useState<string[]>([]);
  const [showAllSensitiveInPreview, setShowAllSensitiveInPreview] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [textareaHeight, setTextareaHeight] = useState<number | undefined>(undefined);

  const [revealedTextIds, setRevealedTextIds] = useState<Record<string, boolean>>({});
  const [revealedImageUrls, setRevealedImageUrls] = useState<Record<string, boolean>>({});
  const [showImageMap, setShowImageMap] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!id) return;
    const postId = parseInt(id);

    const timer = setTimeout(() => {
      getPostDetail(postId).then(postData => {
        setPost(postData);
        setCurrentLikesCount(postData?.likes || 0);
        if (postData) {
          setEditTitle(postData.title);
          setEditContent(postData.content);
          setEditFiles(postData.files || []);
          setEditHashtags(postData.hashtags || []);
        }
      });
      getCommentsByPostId(postId).then(setComments);
      getPostLikeStatus(postId).then(setLiked);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // textarea 높이 동기화
  useEffect(() => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = "auto";
    const newHeight = Math.max(160, ta.scrollHeight);
    ta.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);

    if (overlayRef.current) overlayRef.current.scrollTop = ta.scrollTop;
  }, [editContent]);

  const handleLikeToggle = async () => {
    if (!post) return;
    try {
      if (liked) {
        await unlikePost(post.id);
        setCurrentLikesCount(prev => prev - 1);
      } else {
        await likePost(post.id);
        setCurrentLikesCount(prev => prev + 1);
      }
      setLiked(prev => !prev);
    } catch (err) {
      console.error(err);
      alert("좋아요 상태 변경 실패");
    }
  };

  const handleToggleEdit = () => setIsEditing(prev => !prev);

  const handleSave = async () => {
    if (!post) return;
    try {
      const updatedData = {
        title: editTitle,
        content: editContent,
        files: editFiles,
        hashtags: editHashtags,
      };
      const response = await updatePost(post.id, updatedData);
      setPost(response);
      setIsEditing(false);
      alert("게시글이 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error(err);
      alert("게시글 수정 실패");
    }
  };

  const handleCancel = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditFiles(post.files || []);
    setEditHashtags(post.hashtags || []);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const tempFileObjects = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      fileOriginalName: file.name,
    }));
    setEditFiles(prev => [...prev, ...tempFileObjects]);
    e.target.value = '';
  };

  const handleFileDelete = (index: number) => {
    setEditFiles(prev => prev.filter((_, i) => i !== index));
  };

  const maskSensitiveInText = (text: string, maskChar = "●") => {
    let masked = text;
    for (const { regex } of SENSITIVE_PATTERNS) {
      const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
      masked = masked.replace(re, m => maskChar.repeat(Math.max(4, m.length)));
    }
    return masked;
  };

  const getOverlayText = (text: string) => showAllSensitiveInPreview ? text : maskSensitiveInText(text);

  const renderWithSensitiveBlur = (text?: string) => {
    if (!text) return null;
    type MatchItem = { name: string; start: number; end: number; raw: string };
    const matches: MatchItem[] = [];
    for (const { name, regex } of SENSITIVE_PATTERNS) {
      const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
      for (const m of text.matchAll(re)) {
        if (m.index === undefined) continue;
        matches.push({ name, start: m.index, end: m.index + m[0].length, raw: m[0] });
      }
    }
    if (matches.length === 0) return <span>{text}</span>;
    matches.sort((a,b) => a.start - b.start);
    const filtered: MatchItem[] = [];
    let lastEnd = -1;
    for (const m of matches) if (m.start >= lastEnd) { filtered.push(m); lastEnd = m.end; }
    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    filtered.forEach(m => {
      if (cursor < m.start) nodes.push(<span key={`plain-${cursor}`}>{text.slice(cursor,m.start)}</span>);
      const idKey = `${m.name}-${m.start}-${m.end-m.start}`;
      const revealed = !!revealedTextIds[idKey];
      nodes.push(
        <span key={idKey} className="pd-sensitive-wrapper">
          <span className={`pd-sensitive-text ${revealed?"pd-unblur":"pd-blur"}`}>{m.raw}</span>
          <button className="pd-reveal-btn" onClick={() => setRevealedTextIds(prev => ({...prev,[idKey]:!prev[idKey]}))}>
            {revealed ? "숨기기" : "보기"}
          </button>
        </span>
      );
      cursor = m.end;
    });
    if (cursor < text.length) nodes.push(<span key={`plain-end-${cursor}`}>{text.slice(cursor)}</span>);
    return <>{nodes}</>;
  };

  if (!post) return <div>게시글을 불러오는 중...</div>;

  const filesToDisplay = isEditing ? editFiles : post.files;

  return (
    <>
      <div className="pd-rootcontainer">
        <div className="pd-container">
          {/* Header */}
          <div className="pd-post-header">
            <div className="pd-post-meta">
              <div>글 번호: {post.id}</div>
              <div>조회수 {post.views}</div>
              <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                <span onClick={handleLikeToggle} style={{cursor:'pointer', color:liked?'red':'black'}}>
                  {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </span>
                <span>{currentLikesCount}</span>
              </div>
            </div>
          </div>
          <hr/>

          {/* 제목 + 버튼 */}
          <div className="pd-title-action-row">
            <div className="pd-post-title-area">
              {isEditing ? <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} /> : <h2>{post.title}</h2>}
            </div>
            {currentNickname === post.nickname && (
            <div className="action-buttons">
              {isEditing ? (
                <>
                  <button onClick={handleSave}>저장</button>
                  <button onClick={handleCancel}>취소</button>
                </>
              ) : (
                <>
                  <button onClick={handleToggleEdit}>수정</button>
                  <button>삭제</button>
                </>
              )}
            </div>
            )}
          </div>

          {/* 작성자/날짜 */}
          <div className="pd-post-info">
            <span className="author">작성자: {post.nickname}</span>
            <span className="date">{formatDateTime(post.createdAt)}</span>
          </div>

          {/* 본문 */}
          <div className="pd-post-body">
            {isEditing ? (
              <div style={{position:'relative'}}>
                <div ref={overlayRef} aria-hidden style={{
                  whiteSpace:'pre-wrap', wordBreak:'break-word', padding:12, border:'1px solid #ccc', borderRadius:12,
                  background:'#fff', color:'#222', position:'relative', zIndex:1, overflowY:'auto',
                  height: textareaHeight ? `${textareaHeight}px` : 'auto', minHeight:160
                }}>{getOverlayText(editContent)}</div>
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={e=>setEditContent(e.target.value)}
                  style={{
                    position:'absolute', top:0, left:0, width:'100%', padding:12, border:'1px solid transparent',
                    background:'transparent', color:'transparent', caretColor:'#000', zIndex:2, minHeight:160
                  }}
                />
                <div style={{marginTop:8}}>
                  <label>
                    <input type="checkbox" checked={showAllSensitiveInPreview} onChange={e=>setShowAllSensitiveInPreview(e.target.checked)} />
                    민감정보 전체 보기
                  </label>
                </div>
              </div>
            ) : (
              <div style={{whiteSpace:'pre-wrap'}}>{renderWithSensitiveBlur(post.content)}</div>
            )}
          </div>

          {/* 해시태그 */}
          <div className="pd-hashtags">
            {isEditing ? (
              <input
                value={editHashtags.join(', ')}
                onChange={e=>{
                  const newTags = e.target.value.split(/, |,| /).filter(t=>t.trim()!=='');
                  setEditHashtags(newTags);
                }}
              />
            ) : (
              post.hashtags.map(tag=>`#${tag} `)
            )}
          </div>

          <hr/>

          {/* 첨부파일 */}
          {filesToDisplay && filesToDisplay.length>0 && (
            <div className="pd-attachment">
              {filesToDisplay.map((file,index)=>{
                const name = file.fileOriginalName || (file as any).fileName;
                if (!file || !file.url || !name) return null;
                const ext = name.split('.').pop()?.toLowerCase();
                const isImage = ['jpg','jpeg','png','gif','webp','svg'].includes(ext||'');
                return (
                  <div key={`${file.url}-${index}`} style={{marginBottom:8}}>
                    {isImage ? (
                      <img src={file.url} alt={name} style={{maxWidth:'100%'}} />
                    ) : (
                      <a href={file.url} target="_blank" rel="noopener noreferrer">{name}</a>
                    )}
                    {isEditing && <button onClick={()=>handleFileDelete(index)}>❌</button>}
                  </div>
                );
              })}
              {isEditing && <input type="file" multiple onChange={handleFileChange} />}
            </div>
          )}

          <hr/>

          {id && <Comments postId={parseInt(id)} comments={comments} setComments={setComments} />}
        </div>
      </div>
    </>
  );
}
