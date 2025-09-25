// React의 useState 훅을 불러옵니다
import { useEffect, useState } from "react";

// 게시글을 카드 형태로 보여주는 컴포넌트
import { PostCard } from "../components/PostCard";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import type { Post } from "../types/PostType";
import { GetPosts, SearchPosts } from "../api/PostApi";
import { useParams, useSearchParams } from "react-router-dom";


// 한 페이지에 보여줄 게시글 수
const POSTS_PER_PAGE = 6;

export default function PostList() {
  const { type } = useParams();
  // URL 쿼리 파라미터를 가져옵니다.
  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("searchType");
  const searchText = searchParams.get("searchText");

  // 현재 페이지 번호 상태 (0부터 시작)
  const [currentPage, setCurrentPage] = useState(0);
  const [postData, setPostData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

 
  // 현재 페이지에 보여줄 게시글 인덱스 범위 계산
  const startIndex = currentPage * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

  // 현재 페이지에 해당하는 게시글만 추출
  const visiblePosts = postData.slice(startIndex, endIndex);

  // 다음 페이지가 존재하는지 여부
  const hasNextPage = endIndex < postData.length;

  // 이전 페이지가 존재하는지 여부
  const hasPrevPage = currentPage > 0;

  // 전체 페이지 수 계산 (총 게시글 수 / 페이지당 게시글 수)
  const totalPages = Math.max(1, Math.ceil(postData.length / POSTS_PER_PAGE));

  // 포스트 데이터 가져오는 부분
  const loadPostData = async () => {
    setIsLoading(true);
    setCurrentPage(0);
    try {
      let res: Post[];

      // 검색어가 있을 때는 SearchPosts 함수를 사용
      if (searchText && searchType) {
        console.log(`Searching for "${searchText}" in "${searchType}"...`);
        res = await SearchPosts(type, searchType, searchText);
      } else {
        // 검색어가 없을 때는 기존의 GetPosts 함수를 사용
        console.log(`Fetching all posts for category "${type}"...`);
        res = await GetPosts(type);
      }

      console.log('API에서 받은 원본 응답 데이터:', res);

      // API 응답을 Post 타입으로 매핑
      const mappedPosts = res.map((post: any) => ({
        id: post.postId,
        title: post.title,
        author: post.userNickname,
        image: post.url,
        category: post.categoryId,
        date: post.createdAt,
        views: post.views,
        hashtags: post.hashtags,
      }));

      console.log('매핑 후 최종 데이터:', mappedPosts);

      setPostData(mappedPosts);
    } catch (err) {
      console.error("게시물 조회 중 오류 발생:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPostData();
  }, [type, searchType, searchText]);

 // 삭제 콜백: PostCard에서 호출
  const handleDeletePost = (id: number) => {
    setPostData((prev) => {
      const newPosts = prev.filter((post) => post.id !== id);

      // 현재 페이지가 비어있으면 한 페이지 뒤로 이동
      if (currentPage > 0 && startIndex >= newPosts.length) {
        setCurrentPage((prevPage) => prevPage - 1);
      }

      return newPosts;
    });
  };

  return (
    <div style={{ padding: "16px" }}>
      {/* 게시글 카드들을 2열 3행 그리드로 배치 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(3, auto)",
          gap: "16px",
          justifyContent: "center",
          maxWidth: "750px",
          margin: "0 auto",
        }}
      >
        {/* 현재 페이지에 해당하는 게시글 카드 렌더링 */}
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
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
              cursor: "pointer",
              fontSize: "32px",
              color: "#474747",
            }}
          />
        ) : (
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
          <div style={{ width: "32px" }} />
        )}
      </div>
    </div>
  );
}
