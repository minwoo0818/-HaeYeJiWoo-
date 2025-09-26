import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Dummy Data
const dummyUsers = [
  { email: 'user1@example.com', nickname: 'user1', password: 'password123' },
  { email: 'user2@example.com', nickname: 'user2', password: 'password456' },
];

export default function UserTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell>이메일</TableCell>
            <TableCell>닉네임</TableCell>
            <TableCell>비밀번호</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyUsers.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.nickname}</TableCell>
              <TableCell>********</TableCell> {/* Security: Passwords should not be displayed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
