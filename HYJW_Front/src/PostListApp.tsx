import { useParams, useSearchParams } from "react-router-dom";
import Logo from "./components/Logo";
import SearchBar from "./components/SearchBar";
import PostList from "./pages/PostList";
export default function PostListApp() {

  // URL 경로에서 카테고리 타입 가져오기
  const { type } = useParams(); 
  
  // URL 쿼리 파라미터에서 검색 조건 가져오기
  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("searchType");
  const searchText = searchParams.get("searchText");

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "60px",
        alignItems: "center",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <Logo />
      <SearchBar />
      {/* PostList에 categoryType과 검색 조건을 props로 전달합니다.
        이제 PostList는 이 props를 기반으로 데이터를 가져옵니다.
      */}
      <PostList categoryType={type} searchType={searchType} searchText={searchText} />
    </div>
  );
}
