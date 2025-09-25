import { useEffect, useState } from "react";
import Comments from "../components/Comments";
import '../PostDetail.css'
import { useParams } from "react-router-dom";
import { getPostDetail, getCommentsByPostId, likePost, unlikePost, getPostLikeStatus } from "../postDetailApi";
import type { Post } from "../PostType";
import type { Comment } from "../type";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useLikeStore from "../stores/likeStore";

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
  const { status, likes, setStatus, setLikes, incrementLikes, decrementLikes } = useLikeStore();
  // const navigate = useNavigate();


  useEffect(() => {
    setStatus('loading');
    if (id) {
      const postId = parseInt(id);
      getPostDetail(postId).then(postData => {
        setPost(postData);
        setLikes(postData.likes);
      });
      getCommentsByPostId(postId).then(commentsData => {
        setComments(commentsData);
      });
      getPostLikeStatus(postId).then(likedStatus => {
        console.log(`[DEBUG] API response for getPostLikeStatus for post ${postId}:`, likedStatus);
        setStatus(likedStatus ? 'liked' : 'unliked');
      });
    }
  }, [id, setStatus, setLikes]);

  const handleLikeToggle = async () => {
    if (!post || status === 'loading') return;
    
    const isLiked = status === 'liked';

    // Optimistic UI update
    setStatus(isLiked ? 'unliked' : 'liked');
    if (isLiked) {
      decrementLikes();
    } else {
      incrementLikes();
    }

    try {
      if (isLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      // Revert UI on error
      setStatus(isLiked ? 'liked' : 'unliked');
      if (isLiked) {
        incrementLikes();
      } else {
        decrementLikes();
      }
      console.error("좋아요 토글 실패:", error);
      alert("좋아요 상태를 변경하는 중 오류가 발생했습니다.");
    }
  };

  if (!post) {
    return <div>게시글을 불러오는 중...</div>;
  }

    return (
    <>
    <div className="pd-rootcontainer">
      <div className="pd-container">
        <div className="pd-post-header">
          <div className="pd-post-meta">
            <div className="pd-post-num">  글 번호: {post.id} </div>
            <div className="view-count">조회수 {post.views}</div>     
            {/* 작성자 이름과 좋아요 아이콘 */}
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <span
                onClick={handleLikeToggle}
                style={{
                  cursor: status === 'loading' ? 'default' : 'pointer',
                  color: status === 'liked' ? "red" : "black",
                  fontSize: "20px",
                  borderRadius: "50%",
                  position: "relative",
                  top: "4px",
                }}
              >
                {status === 'liked' && <FavoriteIcon />}
                {status === 'unliked' && <FavoriteBorderIcon />}
                {/* 로딩 중에는 아이콘을 잠시 숨길 수 있습니다 */}
              </span>
              <span>{likes}</span>
            </div>
          </div>
        </div>
      <hr/>

        <div className="pd-post-content"> 

          <div className="pd-post-title-bt">
            <div className="pd-post-title"><h2>{post.title}</h2></div>
            <div className="action-buttons">
                <button className="postupdate">수정</button>
                <button>삭제</button>
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

       </div>  {/* 맨 바깥상자 */}
    </div>   
    </>
    );


}

