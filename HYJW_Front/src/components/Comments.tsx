import { useState, useEffect } from "react";
import type { Comment } from "../type";
import '../PostDetail.css'
import { addComment, deleteComment
  
 } from "../postDetailApi";

interface CommentsProps {
  postId: number;
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
}

export default function Comments({ postId, comments, setComments }: CommentsProps) {
    // 새 댓글 입력 상태
    const [newComment, setNewComment] = useState("");

    // 대댓글 입력 상태: commentId별로 
    const [replyInputs, setReplyInputs] = useState<{ [key: number]: string}> ({});

    // 대댓글 입력창 표시 여부: commentId별
    const [showReplyInput, setShowReplyInput] = useState<{[key: number]: boolean}>({});

    // 새로운 댓글 등록
    const handleAddComment = async () => {
      if(!newComment.trim()) return;
      
      try {
        const createdComment = await addComment({
            content: newComment,
            postId: postId, // Use postId from props
        });
        setComments([...comments, createdComment]);
        setNewComment("");
      } catch (error) {
        console.error("댓글 등록 실패:", error);
        alert("댓글을 등록하는 중 오류가 발생했습니다.");
      }
    }

    // 대댓글 등록
    const handleAddReply = async (parentId: number) => {
      const replyContent = replyInputs[parentId];
      if(!replyContent?.trim()) return;

      try {
        const createdReply = await addComment({
            content: replyContent,
            postId: postId, // Use postId from props
            parentCommentId: parentId,
        });
        setComments([...comments, createdReply]);
        setReplyInputs({...replyInputs, [parentId]: ""});
        setShowReplyInput({...showReplyInput, [parentId]: false});
      } catch (error) {
        console.error("대댓글 등록 실패:", error);
        alert("대댓글을 등록하는 중 오류가 발생했습니다.");
      }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId: number) => {
      if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
        return;
      }
      try {
        await deleteComment(commentId);
        setComments(comments.filter(comment => comment.id !== commentId && comment.parentCommentId !== commentId));
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글을 삭제하는 중 오류가 발생했습니다.");
      }
    };

    // 대댓글 입력창 토글
    const toggleReplyInput = (commentId: number) => {
        setShowReplyInput(prev => ({...prev, [commentId]: !prev[commentId]}));
    }

    // 재귀적으로 댓글과 대댓글을 렌더링하는 함수
    const renderComments = (parentId: number | null = null) => {
      const filteredComments = comments.filter(comment => parentId === null ? (comment.parentCommentId === undefined || comment.parentCommentId === null) : comment.parentCommentId === parentId);
      
      return filteredComments.map(comment => (
        <div key={comment.id} className={parentId !== null ? "pd-reply-comment" : ""}>
          <div className="pd-ex-comment">
            <p>
              <strong>{comment.nickname}</strong>
              <span className="pd-timestamp">{new Date(comment.createAt).toLocaleString()}</span>
              {parentId === null && <button className="pd-write-recomment" onClick={() => toggleReplyInput(comment.id)}>답글쓰기</button>}
            </p>
            <div className="pd-ex-comment-content">
              <p>{comment.content}</p>
              <div className="comment-actions">
                <button>수정</button>
                <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
              </div>
            </div>
            <hr/>
          </div>

          {showReplyInput[comment.id] && (
            <div className="comment-write pd-reply-write">
              <input
                type="text"
                placeholder="대댓글을 입력하세요."
                value={replyInputs[comment.id] || ''}
                onChange={(e) => setReplyInputs({...replyInputs, [comment.id]: e.target.value})}
                style={{ width: "60%", padding: "6px" }}
              />
              <button
                onClick={() => handleAddReply(comment.id)}
                style={{ padding: "6px 12px", marginLeft: "8px", cursor: "pointer" }}
              >
                등록
              </button>
            </div>
          )}
          
          {/* Recursively render replies */}
          <div style={{ marginLeft: '20px' }}>
            {renderComments(comment.id)}
          </div>
        </div>
      ));
    }

    return (
        <>
        <div className="pd-comments-section">
          <h4>댓글 ({comments.filter(c => !c.parentCommentId).length})</h4>

          {/* 최상위 댓글 렌더링 */}
          {renderComments()}

          {/* // 새로운 댓글 작성 영역    */}
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
        </>
    );
}
