import { useState } from "react";
import type { Comment } from "../type";
import "../PostDetail.css";
import {
  addComment,
  deleteComment,
  getCommentsByPostId,
} from "../postDetailApi";
import { useAuthStore } from "../authStore";

interface CommentsProps {
  postId: number;
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
}

export default function Comments({
  postId,
  comments,
  setComments,
}: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [showReplyInput, setShowReplyInput] = useState<{
    [key: number]: boolean;
  }>({});
  const currentNickname = useAuthStore((state) => state.nickname);

  // 새로운 댓글 등록
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const createdComment = await addComment({
        content: newComment,
        postId: postId,
      });
      setComments([...comments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글을 등록하는 중 오류가 발생했습니다.");
    }
  };

  // 🔧 바뀐 부분: 대댓글 등록 시 parentCommentId 포함
  const handleAddReply = async (parentId: number) => {
    const replyContent = replyInputs[parentId];
    if (!replyContent?.trim()) return;
    try {
      const createdReply = await addComment({
        content: replyContent,
        postId: postId,
        parentCommentId: parentId, // 🔧 대댓글 연결을 위한 필드 추가
      });
      setComments([...comments, createdReply]);
      setReplyInputs({ ...replyInputs, [parentId]: "" });
      setShowReplyInput({ ...showReplyInput, [parentId]: false });
    } catch (error) {
      console.error("대댓글 등록 실패:", error);
      alert("대댓글을 등록하는 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const hasReplies = comments.some((c) => c.parentCommentId === commentId);
    const confirmMsg = hasReplies
      ? "대댓글이 달린 댓글입니다. 정말 삭제하시겠습니까?"
      : "댓글을 삭제하시겠습니까?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteComment(commentId);
      const updatedComments = await getCommentsByPostId(postId);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  const toggleReplyInput = (commentId: number) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComments = (parentId: number | null = null) => {
    const filtered = comments.filter((c) =>
      parentId === null
        ? c.parentCommentId === null || c.parentCommentId === undefined
        : c.parentCommentId === parentId
    );

    return filtered.map((comment) => (
      <div
        key={comment.id}
        className={parentId !== null ? "pd-reply-comment" : ""}
      >
        <div className="pd-ex-comment">
          <p>
            <strong>{comment.userNickname}</strong>
            <span className="pd-timestamp">
              {new Date(comment.createAt).toLocaleString()}
            </span>
            {parentId === null && (
              <button
                className="pd-write-recomment"
                onClick={() => toggleReplyInput(comment.id)}
              >
                답글쓰기
              </button>
            )}
          </p>
          <div className="pd-ex-comment-content">
            <p>{comment.content}</p>
            {currentNickname === comment.userNickname && (
              <div className="comment-actions">
                <button>수정</button>
                <button onClick={() => handleDeleteComment(comment.id)}>
                  삭제
                </button>
              </div>
            )}
          </div>
          <hr />
        </div>

        {/* 🔧 바뀐 부분: 대댓글 입력창 */}
        {showReplyInput[comment.id] && (
          <div className="comment-write pd-reply-write">
            <input
              type="text"
              placeholder="대댓글을 입력하세요."
              value={replyInputs[comment.id] || ""}
              onChange={(e) =>
                setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })
              }
              style={{ width: "60%", padding: "6px" }}
            />
            <button
              onClick={() => handleAddReply(comment.id)} // 🔧 대댓글 등록 함수 연결
              style={{
                padding: "6px 12px",
                marginLeft: "8px",
                cursor: "pointer",
              }}
            >
              등록
            </button>
          </div>
        )}

        {/* 재귀 렌더링 */}
        <div style={{ marginLeft: "20px" }}>{renderComments(comment.id)}</div>
      </div>
    ));
  };

  return (
    <div className="pd-comments-section">
      <h4>댓글 ({comments.filter((c) => !c.parentCommentId).length})</h4>
      {renderComments()}
      <div className="comment-write">
        <input
          type="text"
          placeholder="댓글을 입력하세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ width: "70%", padding: "6px" }}
        />
        <button
          onClick={handleAddComment}
          style={{ padding: "6px 12px", marginLeft: "8px", cursor: "pointer" }}
        >
          등록
        </button>
      </div>
    </div>
  );
}
