import { useState } from "react";
import type { Comment } from "../type";
import "../PostDetail.css";
import {
  addComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from "../api/postDetailApi";

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
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

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

  // 대댓글 등록
  const handleAddReply = async (parentId: number) => {
    const replyContent = replyInputs[parentId];
    if (!replyContent?.trim()) return;

    try {
      const createdReply = await addComment({
        content: replyContent,
        postId: postId,
        parentCommentId: parentId,
      });
      setComments([...comments, createdReply]);
      setReplyInputs({ ...replyInputs, [parentId]: "" });
      setShowReplyInput({ ...showReplyInput, [parentId]: false });
    } catch (error) {
      console.error("대댓글 등록 실패:", error);
      alert("대댓글을 등록하는 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    const hasReplies = comments.some(
      (comment) => comment.parentCommentId === commentId
    );
    let confirmationMessage = "댓글을 삭제하시겠습니까?";

    if (hasReplies) {
      confirmationMessage = "대댓글이 달린 댓글입니다. 정말 삭제하시겠습니까?";
    }

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      await deleteComment(commentId);
      const updatedComments = await getCommentsByPostId(postId);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 입력창 토글
  const toggleReplyInput = (commentId: number) => {
    setShowReplyInput((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // 댓글 수정 시작
  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  // 댓글 수정 저장
  const handleSaveEditedComment = async (commentId: number) => {
    if (!editedContent.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }
    try {
      const updated = await updateComment(commentId, editedContent);
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? { ...c, content: updated.content, updateAt: updated.updateAt }
            : c
        )
      );
      setEditingCommentId(null);
      setEditedContent("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글을 수정하는 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  // 재귀적으로 댓글과 대댓글을 렌더링
  const renderComments = (parentId: number | null = null) => {
    const filteredComments = comments.filter((comment) =>
      parentId === null
        ? comment.parentCommentId === undefined ||
          comment.parentCommentId === null
        : comment.parentCommentId === parentId
    );

    return filteredComments.map((comment) => (
      <div
        key={comment.id}
        className={parentId !== null ? "pd-reply-comment" : ""}
      >
        <div className="pd-ex-comment">
          <p>
            <strong>{comment.nickname}</strong>
            <span className="pd-timestamp">
              {new Date(comment.createAt).toLocaleString()}
            </span>
            {comment.updateAt &&
              new Date(comment.createAt).getTime() !==
                new Date(comment.updateAt).getTime() && (
                <span className="pd-timestamp">
                  (수정: {new Date(comment.updateAt).toLocaleString()})
                </span>
              )}
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
            {editingCommentId === comment.id ? (
              <div className="comment-edit-area">
                <input
                  type="text"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  style={{ width: "70%", padding: "6px" }}
                />
                <button
                  onClick={() => handleSaveEditedComment(comment.id)}
                  style={{
                    padding: "6px 12px",
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                >
                  저장
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: "6px 12px",
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                >
                  취소
                </button>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
            <div className="comment-actions">
              {editingCommentId !== comment.id && (
                <button onClick={() => handleEditComment(comment)}>수정</button>
              )}
              {editingCommentId !== comment.id && (
                <button onClick={() => handleDeleteComment(comment.id)}>
                  삭제
                </button>
              )}
            </div>
          </div>
        </div>
        <hr />
        {/* 대댓글 입력창 */}
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
              onClick={() => handleAddReply(comment.id)}
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
