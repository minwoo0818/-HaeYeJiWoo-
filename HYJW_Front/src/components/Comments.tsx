import { useState } from "react";
import type { Comment } from "../type";
import '../PostDetail.css'


export default function Comments() {
    // 댓글 목록 (대댓글 예시 포함)
    const [comments, setComments] = useState<Comment[]>([
      { 
        id: 1, 
        nickname: "사용자 1", 
        content: "첫 번째 댓글입니다.", 
        postId: 1, 
        userId: 1, 
        createAt: "2025-09-23T01:30:00", 
        updateAt: "2025-09-23T01:30:00" 
      },
      { 
       id: 2, 
       nickname: "사용자 2", 
       content: "두 번째 댓글입니다.", 
       postId: 1, 
       userId: 2, 
       createAt: "2025-09-23T01:35:00", 
       updateAt: "2025-09-23T01:35:00" 
      },
      { 
        id: 3, 
        nickname: "사용자 1", 
        content: "첫 번째 댓글에 대한 대댓글입니다.", 
        postId: 1, 
        userId: 1, 
        parentCommentId: 1,
        createAt: "2025-09-23T01:40:00", 
        updateAt: "2025-09-23T01:40:00" 
       }
    ]);

    // 새 댓글 입력 상태
    const [newComment, setNewComment] = useState("");

    // 대댓글 입력 상태: commentId별로 
    const [replyInputs, setReplyInputs] = useState<{ [key: number]: string}> ({});

    // 대댓글 입력창 표시 여부: commentId별
    const [showReplyInput, setShowReplyInput] = useState<{[key: number]: boolean}>({});

    // 새로운 댓글 등록
    const handleAddComment = () => {
      if(!newComment.trim()) return;
      const nextId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1;
      const newCommentObject: Comment = {
        id: nextId,
        nickname: "새로운 유저", // 임시값
        content: newComment,
        postId: 1, //  임시값
        userId: 3, // 임시값
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
      };
      setComments([...comments, newCommentObject]);
      setNewComment("");
    }

    // 대댓글 등록
    const handleAddReply = (parentId: number) => {
      const replyContent = replyInputs[parentId];
      if(!replyContent?.trim()) return;

      const replyNextId = comments.length > 0? Math.max(...comments.map((c) => c.id)) + 1 : 1;
      const reply: Comment = {
        id: replyNextId,
        nickname: "대댓글 유저", // 임시값
        content: replyContent,
        postId: 1, // 임시값
        userId: 99, // 임시값
        parentCommentId: parentId,
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
      };

      setComments([...comments, reply]);
      setReplyInputs({...replyInputs, [parentId]: ""});
      setShowReplyInput({...showReplyInput, [parentId]: false});
    };

    // 대댓글 입력창 토글
    const toggleReplyInput = (commentId: number) => {
        setShowReplyInput(prev => ({...prev, [commentId]: !prev[commentId]}));
    }

    // 재귀적으로 댓글과 대댓글을 렌더링하는 함수
    const renderComments = (parentId: number | null = null) => {
      const filteredComments = comments.filter(comment => parentId === null ? comment.parentCommentId === undefined : comment.parentCommentId === parentId);
      
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
                <button>삭제</button>
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