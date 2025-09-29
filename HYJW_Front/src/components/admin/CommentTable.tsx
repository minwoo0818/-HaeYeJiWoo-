import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { AdminComment } from "../../type";
import { getCommentsForAdmin } from "../../api/CommentApi";

export default function CommentTable() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const fetchComments = async () => {
    try {
      const data = await getCommentsForAdmin();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ width: 1200, margin: "auto" }}>
      <Table aria-label="comments table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              댓글 번호
            </TableCell>
            <TableCell
              align="center"
              sx={{ border: "1px solid black", backgroundColor: "skyblue" }}
            >
              글 제목
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
              댓글 내용
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
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {comment.id}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {comment.title}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {comment.nickname}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {comment.content}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {formatDate(comment.createdAt)}
              </TableCell>
              <TableCell align="center" sx={{ border: "1px solid black" }}>
                {formatDate(comment.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
