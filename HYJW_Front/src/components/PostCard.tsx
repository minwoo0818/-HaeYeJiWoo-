import { useState } from "react";
import type { Post } from "../types/PostType";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../authStore";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const currentNickname = useAuthStore((state) => state.nickname); // ✅ 로그인한 사용자 닉네임

  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
  };

  const handleCardClick = () => {
    navigate(`/postdetail/${post.id}`);
  };
  console.log("로그인 닉네임:", currentNickname);
  console.log("게시글 작성자 닉네임:", post.nickname);

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

      {/* 수정 및 삭제 버튼: 닉네임이 같을 때만 표시 */}
      {currentNickname === post.nickname && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              backgroundColor: "#474747",
              color: "#ffffff",
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
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
