import { useEffect } from "react";
import Comments from "../components/Comments";
import '../PostDetail.css'


export default function PostDetail () {
  useEffect(() => {
    // getPostDetail();
  }, []);


    return (
    <>
      <div className="pd-container">
        <div className="pd-post-header">
          <div className="pd-header">메인 바 / 카테고리</div>
          <div className="pd-post-meta">
            <div className="pd-post-num">  글 번호: * </div>
            <div className="view-count">조회수 10</div>     
            <div><button className="pd-like">♡</button>좋아요 7</div>
          </div>
        </div>
      <hr/>

        <div className="pd-post-content"> 

          <div className="pd-post-title-bt">
            <div className="pd-post-title"><h2>게시글 제목 입니다.</h2></div>
            <div className="action-buttons">
                <button className="postupdate">수정</button>
                <button>삭제</button>
            </div>
          </div> 
        
          <div className="pd-post-info">
            <span className="author"><h3>작성자: 홍길동</h3></span>
            <span className="date">2025.09.21</span>
          </div>

          <div className="pd-post-body">
            본문
          </div>

          <div className="pd-hashtags">
            #해시태그 #게시판
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

