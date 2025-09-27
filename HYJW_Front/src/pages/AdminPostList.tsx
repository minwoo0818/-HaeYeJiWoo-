import { useEffect, useState } from "react";

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
      const res = await fetch("http://localhost:8080/posts/admin/deleted");
      const data = await res.json();
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
      await fetch(`http://localhost:8080/posts/admin/restore/${id}`, {
        method: "PATCH",
      });
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
      const res = await fetch(`http://localhost:8080/posts/admin/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 실패");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message);
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