import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Dummy Data
const dummyComments = [
  { id: 1, postId: 1, nickname: 'user2', content: '좋은 글 감사합니다.', isReply: '댓글', createdAt: '2023-10-27 10:30', updatedAt: '2023-10-27 10:30' },
  { id: 2, postId: 1, nickname: 'user1', content: '천만에요.', isReply: '대댓글', createdAt: '2023-10-27 10:35', updatedAt: '2023-10-27 10:35' },
  { id: 3, postId: 2, nickname: 'user1', content: '잘 보고 갑니다.', isReply: '댓글', createdAt: '2023-10-28 15:00', updatedAt: '2023-10-28 15:00' },
];

export default function CommentTable() {
  return (
    <TableContainer component={Paper} sx={{ width: 1200, margin: 'auto' }}>
      <Table aria-label="comments table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ border: '1px solid black' }}>댓글 번호</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>글 번호</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>유저 닉네임</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>댓글 내용</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>유형</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>작성일시</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>수정일시</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyComments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{comment.id}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{comment.postId}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{comment.nickname}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{comment.content}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{comment.isReply}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{comment.createdAt}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{comment.updatedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
