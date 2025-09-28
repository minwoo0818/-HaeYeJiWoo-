import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Post } from "../../types/PostType";
import { useEffect, useState } from "react";
import { GetPosts } from "../../api/PostApi";

const formatDateTime = (dateString: string | undefined | null) => {
  if (!dateString) {
    return "N/A";
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function PostTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  const fetchPosts = async () => {
    try {
      const data = await GetPosts();

      setPosts(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ width: 1200, margin: "auto" }}>
      <Table aria-label="posts table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              게시물 번호
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              제목
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              내용
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              조회수
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              유저 닉네임
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              카테고리
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              첨부파일
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              해시태그
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              작성일시
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              수정일시
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {post.id}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {post.title}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {post.content}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {post.views}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {post.nickname}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {post.category}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {post.files && post.files.length > 0
                  ? post.files[0].fileName
                  : ""}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {post.hashtags && post.hashtags.length > 0
                  ? post.hashtags.map((tag: string) => `#${tag} `)
                  : ""}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {formatDateTime(post.createdAt)}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {formatDateTime(post.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
