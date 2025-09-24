import { useEffect, useState } from "react";
import Comments from "../components/Comments";
import '../PostDetail.css'
import { useParams } from "react-router-dom";
import { getPostDetail } from "../postDetailApi";
import type { Post } from "../PostType";

export default function PostDetail () {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (id) {
      const postId = parseInt(id);
      getPostDetail(postId).then(setPost);
    }
  }, [id]);

  if (!post) {
    return <div>게시글을 불러오는 중...</div>;
  }

    return (
    <>
      <div className="pd-container">
        <div className="pd-post-header">
          <div className="pd-header">메인 바 / 카테고리</div>
          <div className="pd-post-meta">
            <div className="pd-post-num">  글 번호: {post.id} </div>
            <div className="view-count">조회수 {post.views}</div>     
            <div><button className="pd-like">♡</button>좋아요 {post.likes}</div>
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
            <span className="author"><h3>작성자: {post.author}</h3></span>
            <span className="date">{post.date}</span>
          </div>

          <div className="pd-post-body">
            {post.content}
          </div>

          <div className="pd-hashtags">
            {post.hashtags.map((tag: string) => `#${tag} `)}
          </div>
          
          <hr/>

          <div className="pd-attachment">
            첨부파일: <a href="#">첨부파일.예시 (1MB)</a>
          </div>

          <hr/>

        </div>  {/* 본문여기까지 */}
        
        <Comments/>

       </div>  {/* 맨 바깥상자 */}
    </>
    );


}

