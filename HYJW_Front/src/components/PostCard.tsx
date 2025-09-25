import { useState, useEffect } from "react";
import type { Post } from "../types/PostType";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { likePost, unlikePost, getPostLikeStatus } from "../postDetailApi";

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;   // 삭제 후 부모 (postlist) 상태 갱신 콜백
}
export function PostCard({ post, onDelete }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const navigate = useNavigate();

  useEffect(() => {
    getPostLikeStatus(post.id).then(setLiked);
  }, [post.id]);

  // 좋아요 상태 토글
  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    try {
      if (liked) {
        await unlikePost(post.id);
        setLikesCount((prev) => prev - 1);
      } else {
        await likePost(post.id);
        setLikesCount((prev) => prev + 1);
      }
      setLiked((prev) => !prev);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      alert("좋아요 상태를 변경하는 중 오류가 발생했습니다.");
    }
  };
  // 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = () => {
    navigate(`/postdetail/${post.id}`);
  };
  // 삭제 버튼 클릭
const handleDelete = async (e: React.MouseEvent) => {
  e.stopPropagation(); // 카드 클릭 이벤트 방지
  if (!window.confirm("정말 삭제하시겠습니까?")) return;
  try {
    await axios.delete(`/api/posts/${post.id}`);
    onDelete(post.id); // 부모 상태 갱신
  } catch (err) {
    console.error(err);
    alert("삭제 중 오류가 발생했습니다.");
  }
};
// 수정 버튼 클릭
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    navigate(`/edit/${post.id}`);
  };
  return (
    <div
      onClick={handleCardClick}
      style={{
        border: "3px solid #ccc",
        borderRadius: "12px",
        padding: "10px 20px 15px 20px",
        width: "350px",
        marginBottom: "16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* 게시글 제목 및 작성자 정보 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span>
          {post.id}번 | {post.title}
        </span>
        {/* 작성자 이름과 좋아요 아이콘 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
          <span style={{ fontSize: "15px", color: "#333" }}>
            작성자 : {post.nickname}
          </span>
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
          <span>{likesCount}</span>
        </div>
      </div>
      {/* 카테고리, 날짜, 조회수 */}
      <div style={{ fontSize: "12px", color: "#555", marginBottom: "8px" }}>
        {post.category} | {post.date} | {post.views}명
      </div>
      {/* 해시태그 목록 */}
      <div style={{ fontSize: "12px", marginBottom: "8px" }}>
        {post.hashtags.map((tag: string) => `#${tag} `)}
      </div>
{/* 게시글 이미지 */}
        <div style={{ marginBottom: "8px" }}>
          <img
            src={`http://localhost:8080${post.image}`}
            style={{ width: "80%", borderRadius: "8px" }}
          />
        </div>
      {/* 수정 및 삭제 버튼 */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          style={{
            backgroundColor: "#474747",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          수정
        </button>
        <button
          style={{
            backgroundColor: "#474747",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
}