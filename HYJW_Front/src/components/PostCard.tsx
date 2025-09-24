import { useState } from "react";
import type { Post } from "../PostType";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);

  // 좋아요 상태를 토글하는 함수
  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div
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
            작성자 : {post.author}
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

      {/* 수정 및 삭제 버튼 */}
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

        {/* 게시글 이미지 */}
        <div style={{ marginBottom: "8px" }}>
          <img
            src={post.image}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
}
