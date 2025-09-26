import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { Post } from '../../types/PostType';
import { GetPosts } from '../../api/PostApi';


export default function PostTable() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await GetPosts('all'); // Using GetPosts
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ width: 1200, margin: 'auto' }}>
      <Table aria-label="posts table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ border: '1px solid black' }}>게시물 번호</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>제목</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>내용</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>조회수</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>유저 닉네임</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>카테고리</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>첨부파일</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>작성일시</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>수정일시</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.id}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.title}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.content}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.views}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.nickname}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.category}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.files && post.files.length > 0 ? post.files[0].fileName : '없음'}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.date}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{post.date}</TableCell> {/* Assuming updatedAt is same as createdAt for now */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
