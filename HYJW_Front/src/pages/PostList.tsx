// React의 useState 훅을 불러옵니다
import { useEffect, useState } from "react";

// 게시글을 카드 형태로 보여주는 컴포넌트
import { PostCard } from "../components/PostCard";

// 페이지 이동을 위한 아이콘 (Material UI)
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { getAllPosts } from "../postDetailApi";

export interface Post {
  id: number; // 게시글 고유 ID
  title: string; // 게시글 제목
  author: string; // 작성자 이름
  image: string; // 이미지 경로
  category: string; // 게시글 카테고리
  date: string; // 작성일
  views: number; // 조회수
  hashtags: string[]; // 해시태그 목록
  likes: number; // 좋아요 수
}

// 한 페이지에 보여줄 게시글 수
const POSTS_PER_PAGE = 6;

// 게시글 목록 컴포넌트
export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  // 현재 페이지 번호 상태 (0부터 시작)
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  // 현재 페이지에 보여줄 게시글 인덱스 범위 계산
  const startIndex = currentPage * POSTS_PER_PAGE; // 시작 인덱스
  const endIndex = startIndex + POSTS_PER_PAGE; // 끝 인덱스 (exclusive)

  // 현재 페이지에 해당하는 게시글만 추출
  const visiblePosts = posts.slice(startIndex, endIndex);

  // 다음 페이지가 존재하는지 여부
  const hasNextPage = endIndex < posts.length;

  // 이전 페이지가 존재하는지 여부
  const hasPrevPage = currentPage > 0;

  // 전체 페이지 수 계산 (총 게시글 수 / 페이지당 게시글 수)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return (
    <div style={{ padding: "16px" }}>
      {/* 게시글 카드들을 2열 3행 그리드로 배치 */}
      <div
        style={{
          display: "grid", // 그리드 레이아웃 사용
          gridTemplateColumns: "repeat(2, 1fr)", // 2열 구성
          gridTemplateRows: "repeat(3, auto)", // 3행 구성
          gap: "16px", // 카드 간 간격
          justifyContent: "center", // 가운데 정렬
          maxWidth: "750px", // 최대 너비 제한
          margin: "0 auto", // 수평 가운데 정렬
        }}
      >
        {/* 현재 페이지에 해당하는 게시글 카드 렌더링 */}
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* 페이지 네비게이션 영역 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "24px",
          maxWidth: "200px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* 이전 페이지 아이콘 */}
        {hasPrevPage ? (
          <NavigateBeforeIcon
            onClick={() => setCurrentPage((prev) => prev - 1)} // 이전 페이지로 이동
            style={{
              cursor: "pointer", // 클릭 가능하게 설정
              fontSize: "32px",
              color: "#474747",
            }}
          />
        ) : (
          // 이전 페이지가 없으면 빈 공간으로 대체 (레이아웃 유지)
          <div style={{ width: "32px" }} />
        )}

        {/* 현재 페이지 번호 표시 */}
        <span
          style={{ fontSize: "16px", color: "#474747", textAlign: "center" }}
        >
          {currentPage + 1} / {totalPages}
        </span>

        {/* 다음 페이지 아이콘 */}
        {hasNextPage ? (
          <NavigateNextIcon
            onClick={() => setCurrentPage((prev) => prev + 1)} // 다음 페이지로 이동
            style={{
              cursor: "pointer",
              fontSize: "32px",
              color: "#474747",
            }}
          />
        ) : (
          // 다음 페이지가 없으면 빈 공간으로 대체
          <div style={{ width: "32px" }} />
        )}
      </div>
    </div>
  );
}
