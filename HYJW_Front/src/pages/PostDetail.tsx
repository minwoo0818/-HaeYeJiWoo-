import { useEffect, useState } from "react";
import Comments from "../components/Comments";
import '../PostDetail.css'
import { useParams } from "react-router-dom";
import { getPostDetail, getCommentsByPostId } from "../postDetailApi";
import type { Post } from "../PostType";
import type { Comment } from "../type";
import { useNavigate } from "react-router-dom";

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function PostDetail () {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // 1. ✅ 수정 모드 상태 추가
  const [isEditing, setIsEditing] = useState(false);
  // 2. ✅ 수정 중인 내용을 위한 상태 추가
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');


  useEffect(() => {
    if (id) {
      const postId = parseInt(id);
      getPostDetail(postId).then(postData => {
        setPost(postData);
        // 3. ✅ 기존 데이터를 수정 상태의 초기값으로 설정
        if (postData) {
          setEditTitle(postData.title);
          setEditContent(postData.content);
        }
      });
      getCommentsByPostId(postId).then(commentsData => {
        setComments(commentsData);
      });
    }
  }, [id]);

  // 4. ✅ 수정 모드 토글 함수
  const handleToggleEdit = () => {
    setIsEditing(prev => !prev);
  };
  
  // 5. ✅ 저장(수정) 버튼 핸들러
  const handleSave = async () => {
    if (!post) return;

    const postId = parseInt(id as string);
    const updatedData = {
      ...post, // 기존 데이터 유지
      title: editTitle,
      content: editContent,
      // files, hashtags 등 다른 수정 필드는 여기서 처리해야 합니다.
    };

    try {
        // updatePost 함수는 백엔드에 PUT 요청을 보낸다고 가정
        const response = await updatePost(postId, updatedData); 
        
        setPost(response); // 서버에서 받은 최신 데이터로 업데이트
        setIsEditing(false); // 읽기 모드로 전환
        alert('게시글이 성공적으로 수정되었습니다.');
        
    } catch (error) {
        console.error('게시글 수정 실패:', error);
        alert('게시글 수정에 실패했습니다.');
    }
  };
  
  // 6. ✅ 취소 버튼 핸들러
  const handleCancel = () => {
      // 기존 데이터로 복원하고 읽기 모드로 전환
      if (post) {
          setEditTitle(post.title);
          setEditContent(post.content);
      }
      setIsEditing(false);
  };


  if (!post) {
    return <div>게시글을 불러오는 중...</div>;
  }

    return (
    <>
      <div className="pd-container">
        <div className="pd-post-header">
          <div className="pd-post-meta">
            <div className="pd-post-num">  글 번호: {post.id} </div>
            <div className="view-count">조회수 {post.views}</div>     
            <div><button className="pd-like">♡</button>좋아요 {post.likes}</div>
          </div>
        </div>
      <hr/>

        <div className="pd-post-content"> 

          <div className="action-buttons">
              {/* === 버튼 그룹 전환 === */}
              {isEditing ? (
                <>
                  <button className="postsave" onClick={handleSave}>저장</button>
                  <button className="postcancel" onClick={handleCancel}>취소</button>
                </>
              ) : (
                <>
                  <button className="postupdate" onClick={handleToggleEdit}>수정</button>
                  <button>삭제</button>
                </>
              )}
            </div>
          </div> 
        
          <div className="pd-post-info">
            <span className="author"><h3>작성자: {post.nickname}</h3></span>
            <span className="date">{formatDateTime(post.date)}</span>
          </div>

          <div className="pd-post-body">
            {post.content}
          </div>

          <div className="pd-hashtags">
            {post.hashtags.map((tag: string) => `#${tag} `)}
          </div>
          
          <hr/>

          {post.files && post.files.length > 0 && (
            <div className="pd-attachment">
              첨부파일:
              {post.files.map((file, index) => {
                if (!file || !file.url || !file.fileName) return null; // Basic null/undefined check

                const fileExtension = file.fileName.split('.').pop()?.toLowerCase();
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '');

                return (
                  <div key={`${file.url}-${index}`} className="attachment-item">
                    {isImage ? (
                      <img src={file.url} alt={file.fileName} style={{ maxWidth: '100%', height: 'auto' }} />
                    ) : (
                      <a href={file.url} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <hr/>

        </div>  {/* 본문여기까지 */}
        
        {id && <Comments postId={parseInt(id)} comments={comments} setComments={setComments} />}
</>
    )
  }
    