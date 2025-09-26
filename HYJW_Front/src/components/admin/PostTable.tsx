import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Dummy Data
const dummyPosts = [
  { id: 1, title: '첫 번째 게시글', content: '내용입니다...', views: 150, nickname: 'user1', category: '공지', attachment: 'file1.zip', createdAt: '2023-10-27 10:00', updatedAt: '2023-10-27 11:00' },
  { id: 2, title: '두 번째 게시글', content: '내용입니다...', views: 200, nickname: 'user2', category: '자유', attachment: null, createdAt: '2023-10-28 14:30', updatedAt: '2023-10-28 14:30' },
];

export default function PostTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="posts table">
        <TableHead>
          <TableRow>
            <TableCell>게시물 번호</TableCell>
            <TableCell>제목</TableCell>
            <TableCell>내용</TableCell>
            <TableCell>조회수</TableCell>
            <TableCell>유저 닉네임</TableCell>
            <TableCell>카테고리</TableCell>
            <TableCell>첨부파일</TableCell>
            <TableCell>작성일시</TableCell>
            <TableCell>수정일시</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.content}</TableCell>
              <TableCell>{post.views}</TableCell>
              <TableCell>{post.nickname}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>{post.attachment || '없음'}</TableCell>
              <TableCell>{post.createdAt}</TableCell>
              <TableCell>{post.updatedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
