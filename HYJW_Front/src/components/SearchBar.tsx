import { useState } from "react";
// useSearchParams 훅을 import 합니다.
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Select, MenuItem, Button } from "@mui/material";
import { useAuthStore } from "../authStore";

export default function SearchBar() {
  const navigate = useNavigate();
  // useSearchParams 훅을 사용하여 URL 검색 파라미터를 관리합니다.
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 검색 조건과 검색어를 가져와 상태를 초기화합니다.
  // URL에 값이 없으면 기본값("title", "")을 사용합니다.
  const [searchType, setSearchType] = useState(
    searchParams.get("searchType") || "title"
  );
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") || ""
  );

  // 검색 버튼 클릭 또는 Enter 키 입력 시 실행되는 함수
  const handleSearch = () => {
    // 검색어가 있을 때만 URL에 파라미터를 추가합니다.
    if (searchText.trim() !== "") {
      setSearchParams({
        searchType,
        searchText: searchText.trim(), // 검색어 앞뒤 공백 제거
      });
    } else {
      // 검색어가 비어있다면 URL에서 검색 관련 파라미터를 제거합니다.
      // 이렇게 하면 PostList가 전체 게시물을 다시 불러오게 됩니다.
      setSearchParams({});
    }
  };

  // 글쓰기 버튼 클릭 시 실행되는 함수
  const handleWrite = () => {
    navigate("/addposts");
  };

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "900px",
        gap: "12px",
      }}
    >
      {/* 검색창 영역 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {/* 검색 조건 선택 드롭다운 */}
        <Select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          IconComponent={ArrowDropDownIcon}
          style={{
            minWidth: 80,
            flexShrink: 1,
            backgroundColor: "#474747",
            color: "#ffffff",
            borderRadius: "8px",
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "#474747",
                color: "#ffffff",
              },
            },
          }}
        >
          <MenuItem value="title">제목</MenuItem>
          <MenuItem value="content">내용</MenuItem>
          <MenuItem value="userId">작성자</MenuItem>
          <MenuItem value="hashtag">해시태그</MenuItem>
        </Select>

        {/* 검색어 입력 필드 */}
        <input
          type="text"
          placeholder="검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          style={{
            flex: 1,
            minWidth: 100,
            border: "none",
            outline: "none",
            padding: "4px 8px",
          }}
        />

        {/* 검색 버튼 (아이콘 형태) */}
        <button
          onClick={handleSearch}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "4px 8px",
            flexShrink: 1,
          }}
        >
          <SearchIcon />
        </button>
      </div>

      {/* 글쓰기 버튼 */}
      {isAuthenticated && (
        <Button
          onClick={handleWrite}
          style={{
            height: "50px",
            backgroundColor: "#474747",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "0 16px",
            whiteSpace: "nowrap",
          }}
        >
          글쓰기
        </Button>
      )}
    </div>
  );
}