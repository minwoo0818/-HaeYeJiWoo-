import { useEffect, useState } from "react";
import { PostCard } from "../components/PostCard";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import type { Post } from "../types/PostType";
import { GetPosts, SearchPosts } from "../api/PostApi";
import { useParams, useSearchParams } from "react-router-dom";

const POSTS_PER_PAGE = 6;

export default function PostList() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("searchType");
  const searchText = searchParams.get("searchText");

  const [currentPage, setCurrentPage] = useState(0);
  const [postData, setPostData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const startIndex = currentPage * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const visiblePosts = postData.slice(startIndex, endIndex);
  const hasNextPage = endIndex < postData.length;
  const hasPrevPage = currentPage > 0;
  const totalPages = Math.max(1, Math.ceil(postData.length / POSTS_PER_PAGE));

  const loadPostData = async () => {
    setIsLoading(true);
    setCurrentPage(0);
    try {
      let res: Post[];

      if (searchText && searchType) {
        console.log(`Searching for "${searchText}" in "${searchType}"...`);
        res = await SearchPosts(type!, searchType, searchText);
      } else {
        console.log(`Fetching all posts for category "${type}"...`);
        res = await GetPosts(type);
      }

      console.log("API 응답:", res);

      const mappedPosts: Post[] = res.map((post: Post) => ({
        id: post.id,
        title: post.title,
        nickname: post.userNickname,
        image: post.image,
        category: post.category,
        date: post.date,
        views: post.views,
        hashtags: post.hashtags,
        likes: post.likes,
        content: post.content,
        files: post.files || [],
      }));

      console.log("매핑 후 최종 데이터:", mappedPosts);
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

  const handleDeletePost = (id: number) => {
    setPostData((prev) => {
      const newPosts = prev.filter((post) => post.id !== id);
      if (currentPage > 0 && newPosts.length <= startIndex) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
      return newPosts;
    });
  };

  return (
    <div style={{ padding: "16px" }}>
      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "32px" }}>로딩 중...</div>
      ) : (
        <>
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
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
            ))}
          </div>

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
            {hasPrevPage ? (
              <NavigateBeforeIcon
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{ cursor: "pointer", fontSize: "32px", color: "#474747" }}
              />
            ) : (
              <div style={{ width: "32px" }} />
            )}

            <span style={{ fontSize: "16px", color: "#474747", textAlign: "center" }}>
              {currentPage + 1} / {totalPages}
            </span>

            {hasNextPage ? (
              <NavigateNextIcon
                onClick={() => setCurrentPage((prev) => prev + 1)}
                style={{ cursor: "pointer", fontSize: "32px", color: "#474747" }}
              />
            ) : (
              <div style={{ width: "32px" }} />
            )}
          </div>
        </>
      )}
    </div>
  );
}