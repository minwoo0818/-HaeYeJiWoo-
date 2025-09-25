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

  useEffect(() => {
    fetch("http://localhost:8080/posts/admin/deleted")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleHardDelete = (id: number) => {
    if (!window.confirm("정말 영구 삭제하시겠습니까?")) return;

    fetch(`http://localhost:8080/posts/admin/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("삭제 실패");
        setPosts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>삭제된 게시글 관리</h2>
      {posts.length === 0 ? (
        <p>삭제된 게시글이 없습니다.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "8px" }}>
              {post.title} ({post.author}) - {post.date}
              <button
                style={{ marginLeft: "8px", color: "red" }}
                onClick={() => handleHardDelete(post.id)}
              >
                영구 삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
