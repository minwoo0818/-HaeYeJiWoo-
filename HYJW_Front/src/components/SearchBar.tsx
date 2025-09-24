import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Select, MenuItem, Button } from "@mui/material";

export default function SearchBar() {
  // 검색 조건 상태: 제목, 내용, 작성자, 해시태그 중 선택
  const [searchType, setSearchType] = useState("title");

  // 검색어 상태
  const [searchText, setSearchText] = useState("");

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = () => {
    console.log("검색 조건:", searchType, "검색어:", searchText);
    // 실제 검색 로직은 여기에 추가
  };

  // 글쓰기 버튼 클릭 시 실행되는 함수
  const handleWrite = () => {
    console.log("글쓰기 버튼 클릭");
    // 글쓰기 페이지로 이동하거나 모달을 띄우는 로직 추가 가능
  };

  return (
    <div
      style={{
        display: "flex", // 가로 정렬
        justifyContent: "space-between", // 좌우 요소 간 간격
        alignItems: "center", // 세로 중앙 정렬
        width: "100%",
        maxWidth: "900px", // 최대 너비 제한
        gap: "12px", // 요소 간 간격
      }}
    >
      {/* 검색창 영역 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc", // 테두리
          borderRadius: "8px", // 둥근 모서리
          overflow: "hidden", // 넘치는 부분 숨김
          flex: 1, // 남은 공간을 모두 차지
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
            backgroundColor: "#474747", // 배경색 설정
            color: "#ffffff", // 글자색 설정
            borderRadius: "8px",
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "#474747", // 드롭다운 배경색
                color: "#ffffff", // 드롭다운 글자색
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
          onChange={(e) => setSearchText(e.target.value)} // 입력값 변경 시 상태 업데이트
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
      <Button
        onClick={handleWrite}
        style={{
          height: "50px", // 검색창 높이에 맞춤 (필요 시 조절 가능)
          backgroundColor: "#474747",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "0 16px", // 좌우 여백만 설정
          whiteSpace: "nowrap",
        }}
      >
        글쓰기
      </Button>
    </div>
  );
}
