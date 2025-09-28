import { useEffect, useState } from "react";
import Comments from "../components/Comments";
import '../PostDetail.css'
import { useParams } from "react-router-dom";
import { getPostDetail, getCommentsByPostId, updatePost } from "../postDetailApi";
import type { Post } from "../PostType";
import type { Comment } from "../type";

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
  
  // 1. 수정 모드 상태 추가
  const [isEditing, setIsEditing] = useState(false);
  // 2. 수정 중인 내용을 위한 상태 추가
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  //  8. 수정 중인 파일 목록을 위한 상태 추가
  const [editFiles, setEditFiles] = useState<Post['files']>([]); 
//  9. 수정 중인 해시태그 목록을 위한 상태 추가
const [editHashtags, setEditHashtags] = useState<string[]>([]); 


  useEffect(() => {
    if (id) {
      const postId = parseInt(id);

       console.log('현재 요청하는 게시글 ID:', postId); 

       // ✅ setTimeout을 사용하여 0.5초(500ms) 지연
      const timer = setTimeout(() => {

      getPostDetail(postId).then(postData => {
        setPost(postData);
        // 3. 기존 데이터를 수정 상태의 초기값으로 설정
        if (postData) {
          setEditTitle(postData.title);
          setEditContent(postData.content);
          // ✅ editFiles 초기화
          setEditFiles(postData.files || []); 
          // ✅ editHashtags 초기화
          setEditHashtags(postData.hashtags || []); 
        }
      });

      getCommentsByPostId(postId).then(commentsData => {
        setComments(commentsData);
      });
  }, 500);

  // 컴포넌트가 정리될 때 타이머도 정리
      return () => clearTimeout(timer);
     }
     }, [id]);

  // 4. 수정 모드 토글 함수
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
      // ✅ 수정된 editFiles를 최종 데이터에 포함
       files: editFiles,
       // ✅ editHashtags를 최종 데이터에 포함
      hashtags: editHashtags, 
    };

    // 이 try/catch 블록은 남겨두세요! (함수 호출 담당)
      try {
      const response = await updatePost(postId, updatedData); 

      setPost(updatedData); 

      setIsEditing(false); 
      alert('게시글이 성공적으로 수정되었습니다.');
      } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
      }
      }; // handleSave 종료

    // 7. ✅ 첨부파일 삭제 핸들러 
    const handleFileDelete = (indexToDelete: number) => {
    const currentFiles = editFiles || [];
 
    // 인덱스에 해당하는 파일을 제거한 새 배열을 만듭니다.
    const updatedFiles = currentFiles.filter((_, index) => index !== indexToDelete);

    // ✅ setPost 대신 setEditFiles를 업데이트합니다.
     setEditFiles(updatedFiles);
  };


    // 10. ✅ 새 첨부파일 추가 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const newFiles = Array.from(e.target.files || []);

 // NOTE: 서버에서 파일 업로드를 처리했다면
 //       여기서는 서버에서 받은 파일 정보로 editFiles를 업데이트해야 합니다.
  // 임시로 파일 객체를 생성하여 기존 editFiles에 추가합니다.
 const tempFileObjects = newFiles.map(file => ({
 url: URL.createObjectURL(file), // 미리보기 URL 생성
 fileOriginalName: file.name,
 // ... 기타 서버에 필요한 필드는 여기에 추가 ...
 }));

 setEditFiles(prev => [...prev, ...tempFileObjects]);

 // 파일 선택 후, 동일 파일을 다시 선택할 수 있도록 input을 초기화합니다.
 e.target.value = ''; 
 };

  
  // 6. ✅ 취소 버튼 핸들러
  const handleCancel = () => {
      // 기존 데이터로 복원하고 읽기 모드로 전환
      if (post) {
          setEditTitle(post.title);
          setEditContent(post.content);
          // ✅ editFiles를 원본 post.files로 복원
          setEditFiles(post.files || []); 
          // ✅ 해시태그 복원
          setEditHashtags(post.hashtags || []); 
      }
      setIsEditing(false);
  };


  if (!post) {
    return <div>게시글을 불러오는 중...</div>;
  }

  // ✅ filesToDisplay 변수를 return 문 밖에서 선언합니다.
  const filesToDisplay = isEditing ? editFiles : post.files; // filesToDisplay를 사용

    return (  
    <>
        <div className="pd-container">
            <div className="pd-post-header">
                <div className="pd-post-meta">
                    <div className="pd-post-num"> 글 번호: {post.id} </div>
                    <div className="view-count">조회수 {post.views}</div>
                    <div><button className="pd-like">♡</button>좋아요 {post.likes}</div>
                </div>
            </div>
            <hr/>

            {/* ✅ 수정된 레이아웃: 제목과 버튼을 한 줄에 배치합니다. */}
            <div className="pd-title-action-row">
                
                {/* 1. 제목 영역 (왼쪽) */}
                <div className="pd-post-title-area">
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={editTitle} 
                            onChange={(e) => setEditTitle(e.target.value)} 
                            className="pd-edit-title" 
                            placeholder="제목을 입력하세요."
                        />
                    ) : (
                        <h2>{post.title}</h2>
                    )}
                </div>

                {/* 2. 버튼 그룹 (오른쪽) */}
                <div className="action-buttons">
                    {isEditing ? (
                        <>
                            <button className="postsave" onClick={handleSave}>저장</button>
                            <button className="postcancel" onClick={handleCancel}>취소</button>
                        </>
                    ) : (
                        <>
                            <button className="postupdate" onClick={handleToggleEdit}>수정</button>
                            <button className="pd-delete-btn">삭제</button>
                        </>
                    )}
                </div>
            </div> 
            
            <div className="pd-post-info">
                <span className="author"><h3>작성자: {post.nickname}</h3></span>
                <span className="date">{formatDateTime(post.date)}</span>
            </div>

            {/* ✅ 내용 영역: isEditing에 따라 textarea 또는 div로 전환 */}
            <div className="pd-post-body">
                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="pd-edit-textarea"
                        rows={10}
                    />
                ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {post.content}
                    </div>
                )}
            </div>

             {/* ✅ 해시태그 영역: isEditing에 따라 input 또는 텍스트로 전환 */}
          <div className="pd-hashtags">
          {isEditing ? (
          <input
          type="text"
          // 태그를 쉼표와 공백으로 이어붙여서 입력 필드에 표시합니다.
          value={editHashtags.join(', ')} 
          onChange={(e) => {
                            // 입력된 문자열을 `#`와 공백을 기준으로 다시 배열로 분리합니다.
          const newTags = e.target.value.split(/, |,| /).filter(tag => tag.trim() !== '');
          setEditHashtags(newTags);
          }}
          // 사용자에게 '태그1, 태그2' 형식으로 입력하도록 안내합니다.
        placeholder="해시태그를 태그1, 태그2 형식으로 입력하세요" 
        className="pd-edit-hashtags"
          />
          ) : (
          // 읽기 모드: 기존대로 해시태그 표시
          post.hashtags.map((tag: string) => `#${tag} `)
          )}
          </div>
            
            <hr/>

             {filesToDisplay && filesToDisplay.length > 0 && ( // ✅ filesToDisplay를 사용하여 렌더링 여부 결정
      <div className="pd-attachment">
      첨부파일:
      {filesToDisplay.map((file, index) => { // ✅ filesToDisplay를 순회하도록 수정
      const fileName = file.fileOriginalName || (file as any).fileName; 
      if (!file || !file.url || !fileName) return null; 

      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '');
  {/* ✅ 파일 추가 버튼: isEditing일 때만 표시 */}
 {isEditing && (
 <input 
 type="file" 
 multiple 
 onChange={handleFileChange}
className="pd-file-input"
 />
 )}


      return (
      <div key={`${file.url}-${index}`} className="attachment-item">
      {isImage ? (
      <img src={file.url} alt={fileName} style={{ maxWidth: '100%', height: 'auto' }} />
      ) : (
      <div className="file-link-row"> 
      <a href={file.url} target="_blank" rel="noopener noreferrer">{fileName}</a>
      {isEditing && (
      <button 
      className="file-delete-btn" 
      onClick={() => handleFileDelete(index)}> 
      ❌
      </button>
        )}
        </div>
        )}
        </div>
        );
        })}
        </div>
        )}

  <hr/>

 </div>
 {id && <Comments postId={parseInt(id)} comments={comments} setComments={setComments} />}
    </>
    )}