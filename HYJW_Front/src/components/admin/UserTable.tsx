import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Dummy Data
const dummyUsers = [
  { email: 'user1@example.com', nickname: 'user1', password: 'password123' },
  { email: 'user2@example.com', nickname: 'user2', password: 'password456' },
];

export default function UserTable() {
  return (
    <TableContainer component={Paper} sx={{ width: 1200, margin: 'auto' }}>
      <Table aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ border: '1px solid black', backgroundColor: 'skyblue' }}>이메일</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black', backgroundColor: 'skyblue' }}>닉네임</TableCell>
            <TableCell align="center" sx={{ border: '1px solid black', backgroundColor: 'skyblue' }}>비밀번호</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyUsers.map((user) => (
            <TableRow key={user.email}>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{user.email}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>{user.nickname}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid black' }}>******** {/* Security: Passwords should not be displayed */}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}