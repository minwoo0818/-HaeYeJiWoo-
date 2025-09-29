import { useEffect, useState } from "react";
import { getDeletedPosts, restorePost, hardDeletePost } from "../api/postDetailApi";

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  isDelete: boolean;  
}

export default function AdminPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

 // 삭제된 게시글 불러오기
  const loadDeletedPosts = async () => {
    try {
      const data = await getDeletedPosts();
      // PostCardDto -> Post 형태로 변환
      const formattedPosts: Post[] = data.map((post: any) => ({
        id: post.postId,
        title: post.title,
        author: post.userNickname,
        date: new Date(post.createdAt).toLocaleDateString(),
        isDelete: true,
      }));
      setPosts(formattedPosts);
    } catch (err) {
      console.error(err);
      alert("삭제된 게시글 불러오기 실패");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedPosts();
  }, []);

  // 복구
  const handleRestore = async (id: number) => {
    try {
      await restorePost(id);
      alert("게시글이 복구되었습니다.");
      // 화면에서 제거
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("복구 실패");
    }
  };

  // 영구 삭제
  const handleHardDelete = async (id: number) => {
    if (!window.confirm("정말 영구 삭제하시겠습니까?")) return;
    try {
      await hardDeletePost(id);
      alert("게시글이 영구적으로 삭제되었습니다.");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("영구 삭제 실패");
    }
  };

  if (isLoading) return <p>로딩중...</p>;

  return (
    <div style={{ padding: "16px" }}>
      <h2>삭제된 게시글 관리</h2>
      {posts.length === 0 ? (
        <p>삭제된 게시글이 없습니다.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            maxWidth: "750px",
            margin: "0 auto",
          }}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "2px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3>{post.title}</h3>
                <p>
                  작성자: {post.author} | 날짜: {post.date}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRestore(post.id)}
                >
                  복구
                </button>
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleHardDelete(post.id)}
                >
                  영구 삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}